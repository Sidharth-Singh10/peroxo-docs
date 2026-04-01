import CodeBlock from "./CodeBlock";

interface Step {
  title: string;
  description: React.ReactNode;
  code?: string;
  language?: string;
}

interface StepFlowProps {
  steps: Step[];
}

export default function StepFlow({ steps }: StepFlowProps) {
  return (
    <div className="my-6">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #B7410E, #E85D04)" }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-0.5 flex-1 bg-border-accent min-h-6" />
            )}
          </div>
          <div className={`pb-8 ${i === steps.length - 1 ? "pb-0" : ""} min-w-0 flex-1`}>
            <h4 className="font-semibold text-text mt-1">{step.title}</h4>
            <p className="text-sm text-text-muted mt-1 leading-relaxed">
              {step.description}
            </p>
            {step.code && (
              <CodeBlock
                code={step.code}
                language={step.language || "typescript"}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
