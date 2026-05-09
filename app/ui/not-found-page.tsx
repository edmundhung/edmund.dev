import { Layout } from './layout.tsx';
import { Icon } from './icon.tsx';

export function NotFoundPage() {
  return ({ pathname }: { pathname: string }) => (
    <Layout
      title="Not Found"
      description="The requested page could not be found."
      pathname={pathname}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <a href="/" className="no-underline">
          <Icon className="h-16 w-16 rounded-full bg-white" symbol="logo" />
        </a>
        <h1 className="p-4">404 Not Found</h1>
      </div>
    </Layout>
  );
}
