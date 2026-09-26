import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { StatusBadge } from "./index.jsx";

it("keeps known statuses and explicit emphasis while leaving unknown labels neutral", () => {
  render(
    <>
      <StatusBadge status="Published" />
      <StatusBadge status="Pending confirmation" />
      <StatusBadge status="Unpublished" />
      <StatusBadge status="Draft" size="lg" tone="warning" />
      <StatusBadge status="Disabled" variant="detail" />
      <StatusBadge status="Enabled" variant="knowledge" size="lg" tone="neutral">Neutral availability</StatusBadge>
      <StatusBadge status="Disabled" variant="detail" size="lg" tone="danger">Danger availability</StatusBadge>
    </>,
  );

  expect(screen.getByText("Published").classList.contains("mh-badge--success")).toBe(true);
  expect(screen.getByText("Pending confirmation").classList.contains("mh-badge--warning")).toBe(true);
  expect(screen.getByText("Unpublished").classList.contains("mh-badge--neutral")).toBe(true);
  expect(screen.getByText("Draft").classList.contains("mh-badge--lg")).toBe(true);
  expect(screen.getByText("Draft").classList.contains("mh-badge--warning")).toBe(true);
  expect(screen.getByText("Disabled").classList.contains("mh-badge--neutral")).toBe(true);
  expect(screen.getByText("Neutral availability").classList.contains("mh-badge--neutral")).toBe(true);
  expect(screen.getByText("Danger availability").classList.contains("mh-badge--danger")).toBe(true);
});
