import { redirect } from 'next/navigation';

export default function ContentEngineIndex() {
  // Redirect base /admin/content to the auto-importer
  redirect('/admin/content/import');
}
