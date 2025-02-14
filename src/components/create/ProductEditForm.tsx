// ProductCreateForm.tsx
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThumbnailUploader } from ".";
import useAsync from "../../hooks/useAsync";
import { modifyProduct, modifyThumbnail, getProduct } from "../../utils/api";
import type { ProductType } from "../../types";
import { API_SERVER_DOMAIN } from "../../constants";

const ProductEditForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [createdProductId, setCreatedProductId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { productId } = useParams<{ productId: string }>();
  const { loading: getProductLoading, data: productData } = useAsync(() =>
    getProduct(productId!)
  );

  useEffect(() => {
    if (productData) {
      setName(productData.name);
      setPrice(productData.price);
      setExplanation(productData.explanation);
    }
  }, [productData]);

  const navigate = useNavigate();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const handleExplanationChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setExplanation(event.target.value);
  };

  const { request: modifyProductRequest } = useAsync(modifyProduct, {
    initialRequest: false,
  });

  const { request: thumbnailUploadRequest } = useAsync(modifyThumbnail, {
    initialRequest: false,
  });

  // 상품 수정 제출 핸들러
  const handleUpdateProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedProduct: ProductType = {
      id: productId!,
      name,
      price,
      explanation,
      thumbnail: "", // 썸네일은 별도 처리
    };

    await modifyProductRequest(updatedProduct);

    if (thumbnail) {
      await thumbnailUploadRequest(productId!, thumbnail);
    }

    setIsModalOpen(true); // 수정 완료 후 모달 오픈
  };

  const handlePushProductPage = () => {
    setIsModalOpen(false);
    navigate(`/product/${productId}`);
  };

  if (!productData || getProductLoading) return <CircularProgress />;

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          상품 수정하기
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          {productData?.thumbnail && (
            <img
              src={`${API_SERVER_DOMAIN}/${productData.thumbnail}`}
              alt={productData?.name}
              style={{ width: "100%", maxWidth: 400 }}
            />
          )}
        </Box>
        <form onSubmit={handleUpdateProduct}>
          <TextField
            label="상품 이름"
            fullWidth
            value={name}
            onChange={handleNameChange}
            margin="normal"
          />
          <TextField
            label="가격"
            type="number"
            fullWidth
            value={price}
            onChange={handlePriceChange}
            margin="normal"
          />
          <TextField
            label="상품 설명"
            fullWidth
            multiline
            rows={4}
            value={explanation}
            onChange={handleExplanationChange}
            margin="normal"
          />
          <ThumbnailUploader
            value={thumbnail}
            onChange={(file) => setThumbnail(file)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: 6,
            }}
          >
            수정
          </Button>
        </form>
      </Container>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          상품을 성공적으로 수정했습니다.
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            확인을 누르면 상품상세 페이지로 이동합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePushProductPage} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductEditForm;
