import { createSearchParams, Location, useLocation, useSearchParams } from 'react-router-dom';
import { IStory } from '../types/models';
import { stories } from '../stories';

// 从URL参数中获取故事ID的辅助函数
export const getStoryFromUrlParams = (): IStory | undefined => {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get('storyId');

  if (storyId) {
    return stories.find(story => story.id === storyId);
  }

  return undefined;
};

// 获取URL参数的辅助函数
export const getUrlParams = (location: Location): Record<string, string> => {
  const searchParams = new URLSearchParams(location.search);
  const params: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
};