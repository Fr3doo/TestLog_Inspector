import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import PdfButton from "@/components/PdfButton";
import { PdfGeneratorProvider } from "@/lib/PdfGeneratorContext";
import type { IPdfGenerator } from "@/lib/IPdfGenerator";
import { ParsedLog } from "@testlog-inspector/log-parser";

const sample: ParsedLog = {
  summary: { text: "Résumé" },
  context: {
    scenario: "s1",
    date: "2025-01-01",
    environment: "dev",
    browser: "chrome",
  },
  errors: [],
  misc: { versions: {}, apiEndpoints: [], testCases: [], folderIds: [] },
};

describe("<PdfButton />", () => {
  it("calls the injected generator on click", async () => {
    const generateMock = vi.fn();
    const providerValue: IPdfGenerator = { generate: generateMock };
    render(
      <PdfGeneratorProvider value={providerValue}>
        <PdfButton data={sample} />
      </PdfGeneratorProvider>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
    expect(generateMock).toHaveBeenCalledWith(sample, undefined);
  });

  it("disables the button while generating", async () => {
    let done!: () => void;
    const generateMock = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          done = resolve;
        }),
    );
    const providerValue: IPdfGenerator = { generate: generateMock };
    render(
      <PdfGeneratorProvider value={providerValue}>
        <PdfButton data={sample} />
      </PdfGeneratorProvider>,
    );
    const user = userEvent.setup();
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toBeDisabled();
    done();
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
