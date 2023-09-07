import Image from "next/image";

import Modal from "@/app/components/Modal";

interface ImageModalProps {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen, onClose, src
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80">
        <Image
          alt="image"
          className="object-cover"
          src={src || ''}
          fill
        />
      </div>
    </Modal>
  )
}

export default ImageModal
