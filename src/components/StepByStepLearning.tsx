import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Terminal, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { StepDetail } from "./StepDetail";

export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: "very-easy" | "easy" | "medium" | "hard";
  isCritical?: boolean;
  detail: {
    task: string;
    expectedResult: string;
    codeExample?: string;
    testCase?: string;
    tips?: string[];
  };
}

const sampleSteps: Step[] = [
  {
    id: "step1",
    number: 1,
    title: "Clone and Setup Environment",
    description: "Set up your local development environment and clone the repository",
    difficulty: "very-easy",
    isCritical: true,
    detail: {
      task: "Clone the repository and install all required dependencies. Ensure your development environment has Node.js v18+ and npm installed.",
      expectedResult: "You should see a successful installation message with no errors. Running `npm run dev` should start the development server on localhost:3000.",
      codeExample: `# Clone the repository
git clone https://github.com/example/http-server.git
cd http-server

# Install dependencies
npm install

# Start development server
npm run dev`,
      testCase: "Visit http://localhost:3000 in your browser. You should see the default landing page.",
      tips: [
        "If you encounter permission errors, try using sudo or check your Node.js installation",
        "Make sure port 3000 is not already in use by another application",
        "Check the .env.example file for required environment variables"
      ]
    }
  },
  {
    id: "step2",
    number: 2,
    title: "Understand the Project Structure",
    description: "Learn the architecture and main components of the codebase",
    difficulty: "easy",
    detail: {
      task: "Explore the project directory structure. Identify the main entry point, routing logic, and how requests are handled. Read through the README and understand the core features.",
      expectedResult: "You should be able to explain the data flow from an incoming HTTP request to the response. Understand where middleware is applied and how routes are defined.",
      codeExample: `src/
├── index.ts          # Main entry point
├── routes/           # Route handlers
│   ├── api.ts
│   └── health.ts
├── middleware/       # Express middleware
│   ├── auth.ts
│   └── logger.ts
└── utils/            # Helper functions
    └── response.ts`,
      tips: [
        "Start by reading index.ts to understand the application bootstrap process",
        "Draw a simple diagram of the request/response flow",
        "Use console.log statements to trace execution paths"
      ]
    }
  },
  {
    id: "step3",
    number: 3,
    title: "Implement Basic Routing",
    description: "Add a new GET endpoint that returns JSON data",
    difficulty: "easy",
    isCritical: true,
    detail: {
      task: "Create a new route at /api/users that returns a list of sample users in JSON format. The endpoint should handle GET requests and return proper HTTP status codes.",
      expectedResult: "When you navigate to http://localhost:3000/api/users, you should receive a JSON response with status 200 containing an array of user objects.",
      codeExample: `// src/routes/users.ts
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/users', (req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  
  res.status(200).json({
    success: true,
    data: users
  });
});

export default router;`,
      testCase: `# Test with curl
curl http://localhost:3000/api/users

# Expected output:
{
  "success": true,
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ]
}`,
      tips: [
        "Remember to register your new router in the main index.ts file",
        "Use proper TypeScript types for Request and Response objects",
        "Always return consistent response structures"
      ]
    }
  },
  {
    id: "step4",
    number: 4,
    title: "Add Request Validation Middleware",
    description: "Implement middleware to validate incoming request data",
    difficulty: "medium",
    isCritical: true,
    detail: {
      task: "Create a middleware function that validates POST request bodies for creating new users. The middleware should check for required fields (name, email) and validate email format.",
      expectedResult: "Invalid requests should be rejected with status 400 and a descriptive error message. Valid requests should pass through to the route handler.",
      codeExample: `// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required fields'
    });
  }
  
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }
  
  next();
};

// Usage in routes/users.ts
router.post('/users', validateUser, (req: Request, res: Response) => {
  // Handle user creation
  res.status(201).json({ success: true });
});`,
      testCase: `# Test invalid request
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Charlie"}'

# Expected: 400 error about missing email

# Test valid request
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Charlie", "email": "charlie@example.com"}'

# Expected: 201 success`,
      tips: [
        "Middleware functions must call next() to pass control to the next handler",
        "Always return after sending an error response to prevent further execution",
        "Consider using libraries like Joi or Zod for complex validation schemas"
      ]
    }
  },
  {
    id: "step5",
    number: 5,
    title: "Add Error Handling",
    description: "Implement centralized error handling for the application",
    difficulty: "medium",
    detail: {
      task: "Create a global error handling middleware that catches all errors, logs them appropriately, and returns user-friendly error responses. Handle different types of errors (validation, database, server errors) differently.",
      expectedResult: "All unhandled errors should be caught and logged. Users should receive appropriate HTTP status codes and error messages without exposing sensitive server details.",
      codeExample: `// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';
  
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Register at the end of middleware chain in index.ts
app.use(errorHandler);`,
      testCase: `# Test by throwing an error in a route
router.get('/test-error', () => {
  throw new Error('Test error');
});

# Expected: 500 response with generic error message`,
      tips: [
        "Error handling middleware must be registered last in the middleware chain",
        "Distinguish between operational errors (user-caused) and programmer errors",
        "Never expose stack traces or sensitive information in production",
        "Consider using a logging service like Winston or Pino for better error tracking"
      ]
    }
  }
];

export const StepByStepLearning = () => {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  const getDifficultyColor = (difficulty: Step["difficulty"]) => {
    switch (difficulty) {
      case "very-easy":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getDifficultyBars = (difficulty: Step["difficulty"]) => {
    const bars = {
      "very-easy": 1,
      "easy": 2,
      "medium": 3,
      "hard": 4
    };
    return bars[difficulty];
  };

  if (selectedStep) {
    return (
      <StepDetail
        step={selectedStep}
        onBack={() => setSelectedStep(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Build Your Own HTTP Server</CardTitle>
              <CardDescription className="text-base">
                Learn about TCP servers, HTTP protocols, middleware patterns, and error handling
              </CardDescription>
            </div>
            <Terminal className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sampleSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className="w-full group"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                      {step.number}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        {step.isCritical && (
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="outline"
                      className={`${getDifficultyColor(step.difficulty)} uppercase text-xs font-semibold px-3`}
                    >
                      {step.difficulty.replace("-", " ")}
                      <span className="ml-2 inline-flex gap-0.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-1 h-3 rounded-full ${
                              i < getDifficultyBars(step.difficulty)
                                ? "bg-current"
                                : "bg-current/20"
                            }`}
                          />
                        ))}
                      </span>
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Steps marked with <AlertCircle className="inline h-4 w-4 text-amber-500" /> are critical
              </p>
              <p className="text-sm text-muted-foreground">
                These steps are fundamental to understanding the project. Take extra care to complete them thoroughly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
