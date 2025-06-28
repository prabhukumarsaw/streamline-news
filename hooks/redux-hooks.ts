/**
 * Redux Typed Hooks
 * Created by:  postgres
 * Description: Type-safe Redux hooks for use throughout the application
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

/**
 * Typed useDispatch hook
 * Provides type safety for dispatch actions
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useSelector hook
 * Provides type safety for selecting state
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;