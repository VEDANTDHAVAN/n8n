import { CredentialType } from "@/lib/types";

export type CredentialDTO = {
  id: string;
  name: string;
  value: string;
  userId: string;
  type: CredentialType;
  createdAt: string;
  updatedAt: string;
};

type PrismaCredentialLike = {
  id: string;
  name: string;
  value: string;
  userId: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapCredentialToDTO(
  c: PrismaCredentialLike
): CredentialDTO {
  return {
    id: c.id,
    name: c.name,
    value: c.value,
    userId: c.userId,
    type: c.type as CredentialType,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}
