// types/reports.ts
export interface ReportSneakerDto {
  userEmail: string;
  userName: string;
  sneakerUrl: string;
  sneakerName: string;
  message: string;
}

export interface ReportCommentDto {
  userEmail: string;
  userName: string;
  commentText: string;
  commentAuthor: string;
  sneakerUrl: string;
  sneakerName: string;
  message: string;
}

export type ReportType = 'sneaker' | 'comment';
