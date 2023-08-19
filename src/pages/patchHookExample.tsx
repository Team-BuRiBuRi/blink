import usePatchShop from '@/hooks/usePatchShop';

export default function Page() {
  const { isLoading, isSuccessful, isError, patchShop } = usePatchShop();

  const handleUpdate = async () => {
    await patchShop({ id: 1, fee: '0.0010001' });
  };

  return (
    <div>
      <button onClick={handleUpdate} disabled={isLoading}>
        Update Shop
      </button>

      {isLoading && <p>Updating...</p>}

      {isSuccessful && <p>Update was successful!</p>}

      {isError && <p>Error</p>}
    </div>
  );
}
