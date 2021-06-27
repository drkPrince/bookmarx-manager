import "@reach/dialog/styles.css";
import { Dialog } from "@reach/dialog";

const Modal = ({ modal, setModal, children }) => {
	return (
		<Dialog
			aria-label="somthing"
			isOpen={modal}
			onDismiss={() => setModal(false)}
		>
			{children}
		</Dialog>
	);
};

export default Modal;
