import axios from 'axios';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

export interface CreatePostData {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string;
}

export const createPost = async (data: CreatePostData) => {
  const tagsArray = data.tags 
    ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  const postData = {
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl || undefined,
    tags: tagsArray
  };

  const response = await axios.post('/api/posts', postData);
  return response.data;
};

export const useCreatePostMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<any, Error, CreatePostData, TOnMutateResult>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    ...options,
    mutationFn: createPost,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
};
