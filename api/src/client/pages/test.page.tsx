type PageProps = {
  test: 2;
};

export function getPageProps(): PageProps {
  return { test: 2 };
}

export default function IndexPage({ test }: PageProps) {
  return (
    <div>test: {test}</div>
  );
}
