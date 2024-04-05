import { MouseEventHandler } from "react";
import styles from "@/styles/ui/Category.module.css";
import { Folder } from "../folder";
import Link from "next/link";

interface Prop {
    buttonClicked: MouseEventHandler<HTMLAnchorElement>;
    linkData: any;
    currentCategory: string;
    handleModalClick: MouseEventHandler<HTMLButtonElement>;
}

const Category = ({ buttonClicked, linkData, currentCategory, handleModalClick }: Prop) => {
    return (
        <div className={styles.CategoryWrapper}>
            <div className={styles.Categories}>
                {linkData?.map((folder: any) => {
                    const folderId = folder?.id === "0" ? undefined : folder?.id.toString();
                    const path = !!folderId ? `/optional-catch/${folderId}` : "/optional-catch";

                    return (
                        <Link
                            className={
                                folder.name === currentCategory
                                    ? `${styles.CategoryButton} ${styles.buttonClicked}`
                                    : styles.CategoryButton
                            }
                            key={folder?.id}
                            href={path}
                            data-id={folder?.id}
                            onClick={(e) => buttonClicked(e)}
                        >
                            {folder?.name}
                        </Link>
                    );
                })}
            </div>
            <button className={styles.addFolder} onClick={handleModalClick} id="addFolder">
                폴더 추가하기 +
            </button>
        </div>
    );
};

export default Category;
