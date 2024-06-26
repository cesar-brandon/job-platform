import type { Comment, CommentVote, User } from "@prisma/client";

export type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User | null;
  replies: ReplyComment[];
};

export type ReplyComment = Comment & {
  votes: CommentVote[];
  author: User | null;
};
