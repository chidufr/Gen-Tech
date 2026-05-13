import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/integrations/supabase/server';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'New password must contain at least one special character'),
});

const jsonResponse = (body: unknown, status = 200) => NextResponse.json(body, { status });
const errorResponse = (message: string, status: number, details?: unknown) =>
  jsonResponse({ error: message, details }, status);

const getBearerToken = (header: string | null) => {
  if (!header) return '';
  const normalized = header.trim();
  return normalized.startsWith('Bearer ') ? normalized.slice(7).trim() : '';
};

const formatError = (error: unknown) =>
  error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return errorResponse('Invalid request payload', 400);
    }

    const parseResult = changePasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse('Validation failed', 400, parseResult.error.flatten().fieldErrors);
    }

    const { currentPassword, newPassword } = parseResult.data;
    if (currentPassword === newPassword) {
      return errorResponse('New password must be different from current password', 400);
    }

    const token = getBearerToken(request.headers.get('authorization'));
    if (!token) {
      return errorResponse('Unauthorized', 401);
    }

    const userResult = await supabaseAdmin.auth.getUser(token);
    const user = userResult.data?.user;
    if (userResult.error || !user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const userQuery = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single();

    const email = typeof user.email === 'string' && user.email.length
      ? user.email
      : userQuery.data?.email;

    if (!email || userQuery.error) {
      if (userQuery.error) {
        console.error('Failed to load user email from database:', user.id, userQuery.error);
      }
      return errorResponse('Unable to resolve user email address', 404);
    }

    const verifyResult = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (verifyResult.error || !verifyResult.data?.session) {
      return errorResponse('Current password is incorrect', 400);
    }

    const updateResult = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateResult.error) {
      console.error('Password update failed for user:', user.id, updateResult.error);
      return errorResponse('Failed to update password', 500);
    }

    return jsonResponse({ success: true, message: 'Password updated successfully' }, 200);
  } catch (error) {
    console.error('Unexpected error in change-password:', {
      error: formatError(error),
      url: request.url,
      timestamp: new Date().toISOString(),
    });

    return errorResponse('An unexpected error occurred', 500);
  }
}