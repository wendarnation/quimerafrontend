// hooks/useReports.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { ReportSneakerDto, ReportCommentDto, ReportType } from "@/types/reports";

interface ReportMutationData {
  type: ReportType;
  data: ReportSneakerDto | ReportCommentDto;
}

export function useReportMutation() {
  return useMutation({
    mutationFn: async ({ type, data }: ReportMutationData) => {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ type, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar el reporte');
      }

      return await response.json();
    },
  });
}
