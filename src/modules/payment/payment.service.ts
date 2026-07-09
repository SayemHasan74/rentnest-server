import {
  PaymentProvider,
  PaymentStatus,
  Prisma,
  RentalStatus
} from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

type CreatePaymentPayload = {
  rentalRequestId: string;
};

const paymentInclude = {
  rentalRequest: {
    select: {
      id: true,
      status: true,
      rentalMonths: true,
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          rentAmount: true
        }
      }
    }
  }
};

export const PaymentService = {
  createCheckoutSession: async (
    tenantId: string,
    payload: CreatePaymentPayload
  ) => {
    const rentalRequest = await prisma.rentalRequest.findFirst({
      where: {
        id: payload.rentalRequestId,
        tenantId
      },
      include: {
        property: true
      }
    });

    if (!rentalRequest) {
      throw new AppError(404, "Rental request not found");
    }

    if (rentalRequest.status !== RentalStatus.APPROVED) {
      throw new AppError(400, "Only approved rental requests can be paid", {
        currentStatus: rentalRequest.status
      });
    }

    const completedPayment = await prisma.payment.findFirst({
      where: {
        rentalRequestId: rentalRequest.id,
        status: PaymentStatus.COMPLETED
      }
    });

    if (completedPayment) {
      throw new AppError(409, "This rental request is already paid", {
        paymentId: completedPayment.id
      });
    }

    const amount = new Prisma.Decimal(rentalRequest.property.rentAmount).mul(
      rentalRequest.rentalMonths
    );
    const amountInCents = amount.mul(100).toNumber();

    if (!Number.isInteger(amountInCents) || amountInCents <= 0) {
      throw new AppError(400, "Invalid payment amount", {
        amount: amount.toString()
      });
    }

    const payment = await prisma.payment.create({
      data: {
        rentalRequestId: rentalRequest.id,
        tenantId,
        amount,
        currency: "usd",
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING
      }
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: {
              name: rentalRequest.property.title,
              description: `RentNest rental for ${rentalRequest.rentalMonths} month(s) in ${rentalRequest.property.location}`
            }
          }
        }
      ],
      success_url: `${env.stripeSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: env.stripeCancelUrl,
      metadata: {
        project: "rentnest",
        paymentId: payment.id,
        rentalRequestId: rentalRequest.id,
        tenantId
      }
    });

    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        providerSessionId: session.id,
        method: "card"
      },
      include: paymentInclude
    });

    return {
      payment: updatedPayment,
      checkoutSession: {
        id: session.id,
        url: session.url
      }
    };
  }
};
