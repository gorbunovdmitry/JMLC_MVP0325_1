import albumentations as A

def get_train_augs(img_size=640):
    return A.Compose([
        A.HorizontalFlip(p=0.5),
        A.RandomBrightnessContrast(p=0.2),
        A.RandomSizedBBoxSafeCrop(img_size, img_size, p=0.3),
    ], bbox_params=A.BboxParams(format='yolo'))
