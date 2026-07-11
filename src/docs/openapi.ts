export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "RentNest API",
    version: "1.0.0",
    description:
      "Backend API for a rental property marketplace with tenant, landlord, and admin roles."
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server"
    }
  ],
  tags: [
    { name: "Auth" },
    { name: "Properties" },
    { name: "Categories" },
    { name: "Landlord" },
    { name: "Rentals" },
    { name: "Payments" },
    { name: "Reviews" },
    { name: "Admin" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          errorDetails: { nullable: true }
        }
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: {}
        }
      },
      PropertyInput: {
        type: "object",
        properties: {
          title: { type: "string", example: "Modern apartment in Dhanmondi" },
          description: { type: "string", example: "A bright apartment close to shops and transit." },
          location: { type: "string", example: "Dhanmondi, Dhaka" },
          address: { type: "string", example: "Road 8, Dhanmondi" },
          rentAmount: { type: "number", example: 350 },
          bedrooms: { type: "integer", example: 2 },
          bathrooms: { type: "integer", example: 2 },
          areaSqFt: { type: "integer", example: 1100 },
          amenities: { type: "array", items: { type: "string" }, example: ["Lift", "Parking"] },
          images: { type: "array", items: { type: "string", format: "uri" } },
          status: { type: "string", enum: ["AVAILABLE", "UNAVAILABLE"] },
          categoryId: { type: "string", example: "category-id" }
        }
      }
    }
  },
  paths: {
    "/": {
      get: {
        tags: ["Auth"],
        summary: "API welcome route",
        responses: {
          "200": { description: "API is running" }
        }
      }
    },
    "/api/health": {
      get: {
        tags: ["Auth"],
        summary: "Health check",
        responses: {
          "200": { description: "Server health check passed" }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register tenant or landlord",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                  name: { type: "string", example: "Sample Tenant" },
                  email: { type: "string", example: "tenant@example.com" },
                  password: { type: "string", example: "tenant123" },
                  role: { type: "string", enum: ["TENANT", "LANDLORD"] },
                  phone: { type: "string", example: "+8801700000000" },
                  address: { type: "string", example: "Dhaka, Bangladesh" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Validation error" },
          "409": { description: "Email already registered" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "admin@rentnest.com" },
                  password: { type: "string", example: "admin123" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "User logged in successfully" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user retrieved successfully" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/api/properties": {
      get: {
        tags: ["Properties"],
        summary: "List available properties with filters",
        parameters: [
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "type", in: "query", schema: { type: "string" } },
          { name: "amenities", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } }
        ],
        responses: {
          "200": { description: "Properties retrieved successfully" }
        }
      }
    },
    "/api/properties/{id}": {
      get: {
        tags: ["Properties"],
        summary: "Get property details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Property details retrieved successfully" },
          "404": { description: "Property not found" }
        }
      }
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "List property categories",
        responses: { "200": { description: "Categories retrieved successfully" } }
      },
      post: {
        tags: ["Categories"],
        summary: "Create category as admin",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Villa" },
                  description: { type: "string", example: "Premium rental homes." }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Category created successfully" } }
      }
    },
    "/api/categories/{id}": {
      patch: {
        tags: ["Categories"],
        summary: "Update category as admin",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Apartment" },
                  description: { type: "string", example: "Residential apartments." }
                }
              }
            }
          }
        },
        responses: { "200": { description: "Category updated successfully" } }
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete category as admin",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category deleted successfully" } }
      }
    },
    "/api/landlord/properties": {
      get: {
        tags: ["Landlord"],
        summary: "List current landlord properties",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Landlord properties retrieved successfully" } }
      },
      post: {
        tags: ["Landlord"],
        summary: "Create property listing",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                allOf: [{ $ref: "#/components/schemas/PropertyInput" }],
                required: [
                  "title",
                  "description",
                  "location",
                  "rentAmount",
                  "bedrooms",
                  "bathrooms",
                  "categoryId"
                ]
              }
            }
          }
        },
        responses: { "201": { description: "Property listing created successfully" } }
      }
    },
    "/api/landlord/properties/{id}": {
      put: {
        tags: ["Landlord"],
        summary: "Update own property listing",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PropertyInput" } } }
        },
        responses: { "200": { description: "Property listing updated successfully" } }
      },
      delete: {
        tags: ["Landlord"],
        summary: "Delete own property listing",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Property listing deleted successfully" } }
      }
    },
    "/api/landlord/properties/{id}/availability": {
      patch: {
        tags: ["Landlord"],
        summary: "Update property availability",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: { status: { type: "string", enum: ["AVAILABLE", "UNAVAILABLE"] } }
              }
            }
          }
        },
        responses: { "200": { description: "Property availability updated successfully" } }
      }
    },
    "/api/landlord/requests": {
      get: {
        tags: ["Landlord"],
        summary: "View rental requests for landlord properties",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Landlord rental requests retrieved successfully" } }
      }
    },
    "/api/landlord/requests/{id}": {
      patch: {
        tags: ["Landlord"],
        summary: "Approve or reject rental request",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["APPROVED", "REJECTED"] },
                  rejectionReason: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "Rental request updated successfully" } }
      }
    },
    "/api/landlord/requests/{id}/complete": {
      patch: {
        tags: ["Landlord"],
        summary: "Complete an active, paid rental request",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Rental request completed successfully" },
          "400": { description: "Rental is not active or has no completed payment" },
          "404": { description: "Rental request not found for this landlord" }
        }
      }
    },
    "/api/rentals": {
      post: {
        tags: ["Rentals"],
        summary: "Submit rental request as tenant",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["propertyId", "moveInDate", "rentalMonths"],
                properties: {
                  propertyId: { type: "string", example: "property-id" },
                  moveInDate: { type: "string", format: "date-time" },
                  rentalMonths: { type: "integer", minimum: 1, maximum: 60, example: 12 },
                  message: { type: "string", example: "I would like to move in next month." }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Rental request submitted successfully" } }
      },
      get: {
        tags: ["Rentals"],
        summary: "List current tenant rental requests",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Rental requests retrieved successfully" } }
      }
    },
    "/api/rentals/{id}": {
      get: {
        tags: ["Rentals"],
        summary: "Get current tenant rental request details",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Rental request details retrieved successfully" } }
      }
    },
    "/api/payments/create": {
      post: {
        tags: ["Payments"],
        summary: "Create Stripe checkout session for approved rental",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rentalRequestId"],
                properties: { rentalRequestId: { type: "string", example: "rental-request-id" } }
              }
            }
          }
        },
        responses: { "201": { description: "Stripe checkout session created successfully" } }
      }
    },
    "/api/payments/success": {
      get: {
        tags: ["Payments"],
        summary: "Stripe Checkout success redirect",
        parameters: [{ name: "session_id", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "Checkout completed and verification is processing" } }
      }
    },
    "/api/payments/cancel": {
      get: {
        tags: ["Payments"],
        summary: "Stripe Checkout cancellation redirect",
        responses: { "200": { description: "Checkout was cancelled" } }
      }
    },
    "/api/payments/confirm": {
      post: {
        tags: ["Payments"],
        summary: "Confirm payment status with Stripe session",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["providerSessionId", "status"],
                properties: {
                  providerSessionId: { type: "string", example: "cs_test_example" },
                  status: { type: "string", enum: ["COMPLETED", "FAILED", "CANCELLED"] }
                }
              }
            }
          }
        },
        responses: { "200": { description: "Payment status confirmed successfully" } }
      }
    },
    "/api/payments": {
      get: {
        tags: ["Payments"],
        summary: "Get current tenant payment history",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Payment history retrieved successfully" } }
      }
    },
    "/api/payments/{id}": {
      get: {
        tags: ["Payments"],
        summary: "Get current tenant payment details",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Payment details retrieved successfully" } }
      }
    },
    "/api/payments/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Stripe webhook endpoint",
        responses: { "200": { description: "Stripe webhook processed successfully" } }
      }
    },
    "/api/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Create review after completed rental",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rentalRequestId", "propertyId", "rating"],
                properties: {
                  rentalRequestId: { type: "string", example: "rental-request-id" },
                  propertyId: { type: "string", example: "property-id" },
                  rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                  comment: { type: "string", example: "Clean property and responsive landlord." }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Review created successfully" } }
      }
    },
    "/api/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "List all users",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "role", in: "query", schema: { type: "string", enum: ["TENANT", "LANDLORD", "ADMIN"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ACTIVE", "BANNED"] } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: { "200": { description: "Users retrieved successfully" } }
      }
    },
    "/api/admin/users/{id}": {
      patch: {
        tags: ["Admin"],
        summary: "Ban or unban user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["ACTIVE", "BANNED"] }
                }
              }
            }
          }
        },
        responses: { "200": { description: "User status updated successfully" } }
      }
    },
    "/api/admin/properties": {
      get: {
        tags: ["Admin"],
        summary: "List all properties",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Admin properties retrieved successfully" } }
      }
    },
    "/api/admin/rentals": {
      get: {
        tags: ["Admin"],
        summary: "List all rental requests",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Admin rental requests retrieved successfully" } }
      }
    }
  }
};
