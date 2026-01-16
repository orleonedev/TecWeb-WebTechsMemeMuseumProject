import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeme } from '../api/memes';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createMeme(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memes'] });
      navigate('/'); 
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred during upload.';
      setApiError(errorMessage);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagsInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagsInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!isAuthenticated) {
      setApiError('You must be logged in to upload a meme.');
      return;
    }
    if (!imageFile) {
      setApiError('Please select an image file.');
      return;
    }
    if (!title.trim()) {
      setApiError('Please provide a title for your meme.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (description.trim()) {
      formData.append('description', description);
    }
    formData.append('image', imageFile);
    formData.append('tags', JSON.stringify(tags));

    mutation.mutate(formData);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload New Meme</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Meme Title</span></label>
          <input 
            type="text" 
            placeholder="Enter a catchy title..."
            className="input input-bordered w-full focus:input-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Description (Optional)</span></label>
          <textarea 
            className="textarea textarea-bordered h-24 w-full focus:textarea-primary"
            placeholder="Describe your meme..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Image File</span></label>
          <input 
            type="file" 
            className="file-input file-input-bordered w-full focus:file-input-primary"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imageFile && (
            <div className="mt-4 flex items-center gap-2 text-sm text-base-content/70">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>{imageFile.name}</span>
            </div>
          )}
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Tags (Press Enter to add)</span></label>
          <input 
            type="text" 
            placeholder="e.g., funny, cat, programming"
            className="input input-bordered w-full focus:input-primary"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(tag => (
              <div key={tag} className="badge badge-lg badge-primary gap-2">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="btn btn-xs btn-circle btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-lg w-full"
          disabled={mutation.isPending || !isAuthenticated || !imageFile || !title.trim()}
        >
          {mutation.isPending ? <span className="loading loading-spinner"></span> : 'Upload Meme'}
        </button>
      </form>

      {apiError && (
        <div className="toast toast-top toast-center mt-4">
          <div className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{apiError}</span>
            <button className="btn btn-ghost btn-xs" onClick={() => setApiError(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
