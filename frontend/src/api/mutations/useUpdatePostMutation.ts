import axios from 'axios';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

export interface UpdatePostData {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string;
}

export const updatePost = async ({ id, data }: { id: string; data: UpdatePostData }) => {
  const tagsArray = data.tags 
    ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  const postData = {
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl || undefined,
    tags: tagsArray
  };

  const response = await axios.put(`/api/posts/${id}`, postData);
  return response.data;
};

export const useUpdatePostMutation = <TOnMutateResult = unknown>(
  options?: UseMutationOptions<any, Error, { id: string; data: UpdatePostData }, TOnMutateResult>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    ...options,
    mutationFn: updatePost,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
};
