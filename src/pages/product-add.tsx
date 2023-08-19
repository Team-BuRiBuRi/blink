import ImageInput from '@/components/ImageInput';
import usePostProduct from '@/hooks/usePostProduct';
import { blobToBase64 } from '@/libs/utils';
import { Box, Button, Flex, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';

const AddProductPage = () => {
  const router = useRouter();
  const { isLoading, isSuccessful, isError, postProduct } = usePostProduct();
  const [thumbnailBlob, setThumbnailBlob] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clickFileInputRef = () =>
    fileInputRef.current && fileInputRef.current.click();
  const priceInputRef = useRef<HTMLInputElement>(null);
  const buyPriceInputRef = useRef<HTMLInputElement>(null);
  const buyQuantityInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const onClickConfirm = async () => {
    if (!thumbnailBlob) return;
    console.log({
      shopId: 1,
      price: priceInputRef.current?.value ?? '',
      buyPrice: buyPriceInputRef.current?.value ?? '',
      buyQuantity: parseFloat(buyQuantityInputRef.current?.value ?? '0'),
      name: nameInputRef.current?.value ?? '',
      thumbnail: thumbnailBlob,
    });
    const thumbnailBase64 = await blobToBase64(new Blob([thumbnailBlob]));
    const patchProductResponse = await postProduct({
      shopId: 1,
      price: priceInputRef.current?.value ?? '',
      buyPrice: buyPriceInputRef.current?.value ?? '',
      buyQuantity: parseFloat(buyQuantityInputRef.current?.value ?? '0'),
      name: nameInputRef.current?.value ?? '',
      thumbnail: thumbnailBase64,
    });
    if (patchProductResponse === true) {
      router.push(`/`); //TODO : 이 아이템의 PK를 받아 그 페이지로 보낸다. `/product/${productId}`
    }
  };
  return (
    <Flex direction='column' gap='20px' minHeight='100vh'>
      <Flex w='100%' align='center' gap='10px' mt='15px'>
        <Box
          cursor='pointer'
          onClick={() => {
            router.push('/');
          }}
        >
          <MdArrowBackIosNew size='24px' />
        </Box>
        <Text fontSize='22px' fontWeight='700' flex={1}>
          Add an Item
        </Text>
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item name
        </Text>
        <Input ref={nameInputRef} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item image
        </Text>
        <ImageInput
          onClickInput={clickFileInputRef}
          ref={fileInputRef}
          thumbnailBlob={thumbnailBlob}
          setThumbnailBlob={setThumbnailBlob}
        />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Cost price
        </Text>
        <Input type='number' ref={buyPriceInputRef} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Total count
        </Text>
        <Input type='number' ref={buyQuantityInputRef} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Sale price
        </Text>
        <Input type='number' ref={priceInputRef} />
      </Flex>
      <Box flex={1} />
      <SimpleGrid columns={2} gap='11px' pb='26px'>
        <Button
          colorScheme='gray'
          onClick={() => {
            router.push('/');
          }}
        >
          Cancel
        </Button>
        <Button colorScheme='red' onClick={onClickConfirm}>
          Complete
        </Button>
      </SimpleGrid>
    </Flex>
  );
};

export default AddProductPage;
