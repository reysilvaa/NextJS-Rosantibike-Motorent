'use client';

import BlogList from '@/components/blog/blog-list';
import BlogSidebar from '@/components/blog/blog-sidebar';
import { useAppTranslations } from '@/i18n/hooks';

export default function BlogPageContent() {
  const { t } = useAppTranslations();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">{t('blog')}</h1>
          <p className="text-gray-400 max-w-3xl">{t('blogDescription')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <BlogList />
          </div>
          <div className="lg:w-1/3">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
