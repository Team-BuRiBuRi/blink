import { Center, Input } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { HiPhotograph } from 'react-icons/hi';

type ImageInputProps = {
  onClickInput: () => void;
  ref: React.ForwardedRef<HTMLInputElement>;
};

const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  (props, ref) => {
    return (
      <Center
        w='100px'
        h='100px'
        borderRadius='14px'
        bg='#E2E8F0'
        cursor='pointer'
        onClick={props.onClickInput}
      >
        <Input
          type='file'
          ref={ref}
          hidden
          accept='image/png, image/jpeg, image/jpg'
        />
        <HiPhotograph size='48px' />
      </Center>
    );
  }
);

ImageInput.displayName = 'ImageInput';

export default ImageInput;
