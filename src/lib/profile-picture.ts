import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import {
  FILE_IMAGE_REGEX,
  PROFILE_PICTURE_CROP_EXPORT_SIZE,
  PROFILE_PICTURE_CROP_PNG_QUALITY,
} from '@/constants/images';
import { fileSizeInDecimalMb } from '@/lib/auth-requirements';

export type PreparedProfilePicture = {
  uri: string;
  mimeType: string;
  fileSize: number;
};

export class ProfilePictureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfilePictureError';
  }
}

export async function pickAndPrepareProfilePicture(
  maximumSizeMb: number,
): Promise<PreparedProfilePicture | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new ProfilePictureError('Photo library permission is required to set a profile picture.');
  }

  const picked = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (picked.canceled || !picked.assets[0]) return null;

  const asset = picked.assets[0];
  const mimeType = asset.mimeType ?? 'image/jpeg';
  if (!FILE_IMAGE_REGEX.test(mimeType)) {
    throw new ProfilePictureError('The profile picture must be a JPEG, PNG, WebP, GIF, or BMP image.');
  }

  const context = ImageManipulator.manipulate(asset.uri);
  context.resize({
    width: PROFILE_PICTURE_CROP_EXPORT_SIZE,
    height: PROFILE_PICTURE_CROP_EXPORT_SIZE,
  });
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    format: SaveFormat.PNG,
    compress: PROFILE_PICTURE_CROP_PNG_QUALITY,
  });

  const fileSize = await measureUriBytes(result.uri);
  if (fileSize > 0 && fileSizeInDecimalMb(fileSize) > maximumSizeMb) {
    throw new ProfilePictureError(
      `The profile picture must be ${maximumSizeMb} MB or smaller.`,
    );
  }

  return {
    uri: result.uri,
    mimeType: 'image/png',
    fileSize,
  };
}

export async function appendProfilePicture(
  form: FormData,
  picture?: PreparedProfilePicture | null,
): Promise<void> {
  if (!picture) {
    if (typeof File !== 'undefined') {
      form.append('profilePicture', new File([], 'profile-picture.png', { type: 'image/png' }));
      return;
    }

    if (typeof Blob !== 'undefined') {
      form.append('profilePicture', new Blob([], { type: 'image/png' }), 'profile-picture.png');
      return;
    }

    form.append('profilePicture', {
      uri: 'data:image/png;base64,',
      name: 'profile-picture.png',
      type: 'image/png',
    } as unknown as Blob);
    return;
  }

  if (Platform.OS === 'web') {
    const response = await fetch(picture.uri);
    const blob = await response.blob();
    const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
    form.append('profilePicture', file);
    return;
  }

  form.append('profilePicture', {
    uri: picture.uri,
    name: 'profile-picture.png',
    type: 'image/png',
  } as unknown as Blob);
}

async function measureUriBytes(uri: string): Promise<number> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  } catch {
    return 0;
  }
}
