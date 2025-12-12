import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { Resource } from "@opentelemetry/resources";
import { ZoneContextManager } from "@opentelemetry/context-zone";

export const initInstrumentation = () => {
  const provider = new WebTracerProvider({
    resource: new Resource({
      "service.name": "delineate-frontend",
    }),
  });

  const exporter = new OTLPTraceExporter({
    // Ensure this URL is correct for your local setup
    url: "http://localhost:4318/v1/traces",
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  provider.register({
    contextManager: new ZoneContextManager(),
  });

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [/.+/g],
        clearTimingResources: true,
      }),
    ],
  });

  console.log("Observability initialized successfully");
};
