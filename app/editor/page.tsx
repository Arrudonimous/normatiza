import { EditorClient } from "@/components/document-editor/editor-client";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getDocument } from "@/lib/db/documents";
import type { DocumentBlock, DocumentMetadata } from "@/lib/document-model";
import type { Reference } from "@/lib/abnt/types";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await searchParams;

  let initialDocument = null;
  if (id) {
    const doc = await getDocument(id);
    // Só carrega se o documento não tiver dono ainda ou já for desse usuário; documento
    // de outra pessoa é tratado como inexistente, sem vazar que ele existe.
    if (doc && (!doc.userId || doc.userId === user?.id)) {
      initialDocument = {
        id: doc.id,
        metadata: doc.metadata as DocumentMetadata,
        blocks: (doc.content as { blocks?: DocumentBlock[] }).blocks ?? [],
        references: doc.references as Reference[],
      };
    }
  }

  return (
    <EditorClient
      key={initialDocument?.id ?? "new"}
      initialUser={user ? { id: user.id, email: user.email } : null}
      initialDocument={initialDocument}
    />
  );
}
