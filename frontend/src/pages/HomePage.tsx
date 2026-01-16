import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getMemes, MemeQueryParams } from '../features/memes/api/memes';
import MemeGrid from '../features/memes/components/MemeGrid';

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [params, setParams] = useState<MemeQueryParams>({
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 10,
    sortBy: (searchParams.get('sortBy') as 'date' | 'popularity') || 'date',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    tag: searchParams.get('tag') || undefined,
    search: searchParams.get('search') || undefined,
  });

  const [mobileSearchTerm, setMobileSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const sortBy = searchParams.get('sortBy') as 'date' | 'popularity';
    const order = searchParams.get('order') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);

    setParams({
      page,
      limit: 10,
      sortBy: sortBy || 'date',
      order: order || 'desc',
      tag: tag || undefined,
      search: search || undefined,
    });
    
    setMobileSearchTerm(search || '');
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['memes', params],
    queryFn: () => getMemes(params),
  });

  const updateURLParams = (newParams: Partial<Record<string, string | number>>) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };
    
    Object.keys(updated).forEach(key => {
      if (updated[key] === undefined || updated[key] === '') {
        delete updated[key];
      }
    });

    setSearchParams(updated as Record<string, string>);
  };

  const handlePageChange = (newPage: number) => {
    updateURLParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchTerm.trim()) {
      updateURLParams({ search: mobileSearchTerm, page: 1 });
    } else {
      updateURLParams({ search: '', page: 1 });
    }
  };

  const [tagsInput, setTagsInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [pendingSortBy, setPendingSortBy] = useState<'date' | 'popularity'>('date');

  useEffect(() => {
    if (params.tag) {
      setSelectedTags(params.tag.split(','));
    } else {
      setSelectedTags([]);
    }
    setPendingSortBy(params.sortBy || 'date');
  }, [params.tag, params.sortBy]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagsInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagsInput.trim().toLowerCase();
      if (!selectedTags.includes(newTag)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPendingSortBy(e.target.value as 'date' | 'popularity');
  };

  const handleFilterApply = () => {
    const tagString = selectedTags.join(',');
    updateURLParams({ tag: tagString, sortBy: pendingSortBy, page: 1 });
  };

  const hasChanges = () => {
    const currentTagString = params.tag || '';
    const newTagString = selectedTags.join(',');
    const currentSort = params.sortBy || 'date';
    
    return currentTagString !== newTagString || currentSort !== pendingSortBy;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Museum Gallery</h1>
          <p className="text-base-content/60 mt-1">Discover the latest and greatest memes.</p>
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleMobileSearch} className="form-control mt-4 sm:hidden">
            <div className="join w-full">
              <input 
                type="text" 
                placeholder="Search memes..." 
                className="input input-bordered join-item w-full"
                value={mobileSearchTerm}
                onChange={(e) => setMobileSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-neutral join-item">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Filter Group */}
            <div className="flex flex-wrap gap-2 items-center">
              <input 
                type="text" 
                placeholder="Filter by tags... (Enter)" 
                className="input input-bordered w-full md:max-w-[200px]" 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleAddTag}
              />

              <select 
                className="select select-bordered w-full md:max-w-[150px]" 
                value={pendingSortBy}
                onChange={handleSortChange}
              >
                <option value="date">Newest</option>
                <option value="popularity">Most Popular</option>
              </select>

              <button 
                onClick={handleFilterApply} 
                className="btn btn-primary"
                disabled={!hasChanges()}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Active Tags Badges */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mt-2">
              {selectedTags.map(tag => (
                <div key={tag} className="badge badge-primary gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="btn btn-xs btn-circle btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-3 h-3 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : isError ? (
        <div className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error loading memes. Please try again later.</span>
        </div>
      ) : (
        <>
          <MemeGrid memes={data?.memes || []} />
          
          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="join border border-base-300 shadow-sm">
                <button 
                  className="join-item btn btn-ghost"
                  disabled={params.page === 1}
                  onClick={() => handlePageChange(params.page! - 1)}
                >
                  «
                </button>
                {[...Array(data.pagination.totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    className={`join-item btn btn-ghost ${params.page === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="join-item btn btn-ghost"
                  disabled={params.page === data.pagination.totalPages}
                  onClick={() => handlePageChange(params.page! + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;

