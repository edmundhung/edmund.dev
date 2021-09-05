import { ReactElement } from "react";
import { Link } from "react-router-dom";

interface CardProps {
  name: string;
  metadata: Metadata;
}

function getDefaultLayout(type: string) {
  switch (type) {
    case 'blog':
      return 'col-span-2';
    case 'projects':
      return 'col-span-3';
    default:
      return '';
  }
}

function Card({ name, metadata }: CardProps): ReactElement {
  const [type, slug] = name.split('/');

  return (
    <article className={`flex flex-col rounded overflow-hidden bg-white text-primary shadow-sm ${metadata.layout ?? getDefaultLayout(type)}`.trim()}>
      <Link className="no-underline flex-grow" to={`/${name}`}>
        {!metadata.image ? null : (
          <figure>
            <img src={metadata.image} alt="cover" />
          </figure>
        )}
        <section className="p-4">
          <div className="capitalize text-secondary text-xs font-light my-1">{type}</div>
          <h2 className="my-0 text-xl">{metadata.title}</h2>
          {!metadata.description ? null : (
            <p className="mt-2 text-sm">{metadata.description}</p>
          )}
        </section>
      </Link>
      {!metadata.tags ? null : (
        <footer className="p-4 text-sm border-t">
          <div className="divide-x -mx-2">
            {metadata.tags.map(tag => <Link key={tag} className="no-underline px-2 hover:underline" to={`?tag=${tag}`}>{tag}</Link>)}
          </div>
        </footer>
      )}
    </article>
  )
}

export default Card;
