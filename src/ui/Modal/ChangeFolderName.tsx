import styles from "@/styles/ui/Modal.module.css";

function ChangeFolderName({ currentCategory }: { currentCategory: string }) {
  return (
    <>
      <div className={styles.ModalTitle}>폴더 이름 변경</div>
      <input placeholder={currentCategory}></input>
      <button className={styles.submitButton}>변경하기</button>
    </>
  );
}

export default ChangeFolderName;
