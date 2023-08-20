import ImageInput from '@/components/ImageInput';
import usePostProduct from '@/hooks/usePostProduct';
import { blobToBase64, objectUrlToBlob } from '@/libs/utils';
import { Box, Button, Flex, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';

const AddProductPage = () => {
  const router = useRouter();
  const { postProduct } = usePostProduct();
  const [thumbnail, setThumbnailBlob] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clickFileInputRef = () =>
    fileInputRef.current && fileInputRef.current.click();
  const priceInputRef = useRef<HTMLInputElement>(null);
  const buyPriceInputRef = useRef<HTMLInputElement>(null);
  const buyQuantityInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const onClickConfirm = async () => {
    if (!thumbnail) return;

    const thumbnailBlob = await objectUrlToBlob(thumbnail);
    const thumbnailBase64 = await blobToBase64(thumbnailBlob);

    const postProductResponse = await postProduct({
      shopId: 1,
      price: priceInputRef.current?.value ?? '',
      buyPrice: buyPriceInputRef.current?.value ?? '',
      buyQuantity: parseFloat(buyQuantityInputRef.current?.value ?? '0'),
      name: nameInputRef.current?.value ?? '',
      thumbnail: thumbnailBase64.split(',')[1],
    });
    if (postProductResponse !== -1) {
      router.replace(`/product/${postProductResponse}`);
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
        <Text color={'#F45D44'} fontSize='20px' fontWeight={500}>
          Item Name
        </Text>
        <Input ref={nameInputRef} bgColor={'white'} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text color={'#F45D44'} fontSize='20px' fontWeight={500}>
          Item Image
        </Text>
        <ImageInput
          onClickInput={clickFileInputRef}
          ref={fileInputRef}
          thumbnailBlob={thumbnail}
          setThumbnailBlob={setThumbnailBlob}
        />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text color={'#F45D44'} fontSize='20px' fontWeight={500}>
          Cost Price
        </Text>
        <Input type='number' ref={buyPriceInputRef} bgColor={'white'} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text color={'#F45D44'} fontSize='20px' fontWeight={500}>
          Total Count
        </Text>
        <Input type='number' ref={buyQuantityInputRef} bgColor={'white'} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text color={'#F45D44'} fontSize='20px' fontWeight={500}>
          Sale Price
        </Text>
        <Input type='number' ref={priceInputRef} bgColor={'white'} />
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
