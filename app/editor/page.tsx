import { EditorClient } from "@/components/document-editor/editor-client";
import { SiteHeader } from "@/components/ui/site-header";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function EditorPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <SiteHeader currentPath="editor" />
      <EditorClient initialUser={user ? { id: user.id, email: user.email } : null} />
    </div>
  );
}
