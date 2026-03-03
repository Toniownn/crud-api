import { Container } from "../components/layout/Container";
import { VALUE_PROPS } from "../lib/mock-data";

export function ValuePropsSection() {
  return (
    <section className="border-t border-border py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title}>
              <h3 className="font-display text-lg text-text-primary">{prop.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
