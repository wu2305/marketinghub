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
    </>,
  );

  expect(screen.getByText("Published").classList.contains("mh-badge--success")).toBe(true);
  expect(screen.getByText("Pending confirmation").classList.contains("mh-badge--pending")).toBe(true);
  expect(screen.getByText("Unpublished").classList.contains("mh-badge--neutral")).toBe(true);
  expect(screen.getByText("Draft").classList.contains("mh-badge--lg")).toBe(true);
  expect(screen.getByText("Draft").classList.contains("mh-badge--warning")).toBe(true);
});
