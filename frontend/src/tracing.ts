import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

export function initInstrumentation() {
  const provider = new WebTracerProvider({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: "delineate-frontend",
    }),
  });

  // Export to Jaeger via OTLP (through the collector or directly if CORS allows)
  // In this setup, we'll try to use the OTLP/HTTP exporter
  const exporter = new OTLPTraceExporter({
    url: "http://localhost:14318/v1/traces", // Adjust if using a collector
  });

  // Use 'as any' to bypass the version mismatch between sdk-trace-base and sdk-trace-web
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter) as any);
  // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter())); // For debugging

  provider.register({
    contextManager: new ZoneContextManager(),
  });

  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new UserInteractionInstrumentation(),
      new XMLHttpRequestInstrumentation(),
      new FetchInstrumentation(),
    ],
  });
}
