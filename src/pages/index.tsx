import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const categories = [
  {
    title: 'User documentation',
    description: 'Learn how to set up and use AirConsole.',
    href: '/docs/docs/user/',
  },
  {
    title: 'Developer documentation',
    description: 'Find technical guidance for building and contributing.',
    href: '/docs/docs/developer/',
  },
  {
    title: 'Creating a new game',
    description: 'Learn how to build and integrate a new AirConsole game.',
    href: '/docs/docs/creating-a-game/',
  },
  {
    title: 'Exploring existing games',
    description: 'Browse and understand the games already available.',
    href: '/docs/docs/exploring-games/',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout title="Documentation" description="AirConsole documentation hub">
      <main className={styles.main}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>AirConsole</p>
          <h1>Documentation</h1>
          <p className={styles.intro}>Choose a section to get started.</p>

          <div className={styles.grid}>
            {categories.map((category) => (
              <Link className={styles.card} key={category.href} to={category.href}>
                <h2>{category.title}</h2>
                <p>{category.description}</p>
                <span aria-hidden="true">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
