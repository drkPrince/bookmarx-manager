import { Dialog } from "@reach/dialog";

const Modal = ({ modal, setModal, children }) => {
	return (
		<Dialog
			aria-label="somthing"
			isOpen={modal}
			onDismiss={() => setModal(false)}
		>
			<div className="px-7 py-8">{children}</div>
		</Dialog>
	);
};

export default Modal;
