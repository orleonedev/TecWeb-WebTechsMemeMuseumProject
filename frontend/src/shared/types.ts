export interface UserDto {
  username: string;
}

export interface TagDto {
  id: number;
  name: string;
}

export interface VoteDto {
  userId: number;
  value: number;
  memeId: number;
}

export interface CommentDto {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  memeId: number;
  user: UserDto;
}

export interface MemeCountDto {
  votes: number;
  comments: number;
}

export interface MemeDto {
  id: number;
  title: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  userId: number;
  user: UserDto;
  tags: TagDto[];
  votes: VoteDto[];
  comments?: CommentDto[];
  _count: MemeCountDto;
  score: number;
}

export interface MemesResponse {
  memes: MemeDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
