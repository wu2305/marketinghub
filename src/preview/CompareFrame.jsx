import React from "react";

export function CompareDecorator(Story, context) {
  const reference = context.parameters?.reference;
  if (context.globals?.compare !== "on" || !reference) return <Story />;
  return (
    <div className="mh-compare">
      <section className="mh-compare-pane">
        <header>Storybook</header>
        <div className="mh-compare-stage">
          <Story />
        </div>
      </section>
      <section className="mh-compare-pane">
        <header>Original HTML</header>
        <iframe title="Original HTML" src={reference} />
      </section>
    </div>
  );
}
