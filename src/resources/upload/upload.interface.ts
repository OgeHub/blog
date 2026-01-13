export enum UploadType {
    User = 'user',
    Post = 'post',
}

export const folderMap: Record<UploadType, string> = {
    user: 'users/avatars',
    post: 'posts/avatars',
}

export const TRANSFORMATIONS: Record<UploadType, any[]> = {
    [UploadType.User]: [
        {
            width: 300,
            height: 300,
            crop: 'thumb',
            gravity: 'face',
        },
        { fetch_format: 'auto', quality: 'auto' },
    ],
    [UploadType.Post]: [{ fetch_format: 'auto', quality: 'auto' }],
}
