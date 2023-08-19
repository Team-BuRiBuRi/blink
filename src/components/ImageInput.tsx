import { Center, Image, Input } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { HiPhotograph } from 'react-icons/hi';

type ImageInputProps = {
  onClickInput: () => void;
  ref: React.ForwardedRef<HTMLInputElement>;
  thumbnailBlob: string | null;
  setThumbnailBlob: (newThumbnailBlob: string) => void;
};

const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  (props, ref) => {
    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileInput = e.target;
      if (fileInput.files && fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const blob = new Blob([imageFile], { type: imageFile.type });
        props.setThumbnailBlob(URL.createObjectURL(blob));
      }
    };
    return (
      <Center
        w='100px'
        h='100px'
        borderRadius='14px'
        bg='#E2E8F0'
        cursor='pointer'
        onClick={props.onClickInput}
        overflow='hidden'
      >
        <Input
          type='file'
          ref={ref}
          hidden
          accept='image/png, image/jpeg, image/jpg'
          onChange={onInput}
        />
        {props.thumbnailBlob ? (
          <Image src={props.thumbnailBlob} w='100px' h='100px' alt='input' />
        ) : (
          <HiPhotograph size='48px' />
        )}
      </Center>
    );
  }
);

ImageInput.displayName = 'ImageInput';

export default ImageInput;
