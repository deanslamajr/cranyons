import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles["pic-container"]}>
        <div
          className={styles.cranyon}
          style={{
            backgroundImage:
              "url(https://s3.amazonaws.com/pics.cranyons.com/houseaccess.jpg), url(https://s3.amazonaws.com/pics.cranyons.com/houseaccess.jpg)",
          }}
        ></div>
      </div>
    </main>
  );
}
