import React, {useEffect, useState} from 'react';
import s from './About.module.scss';
import makeRequest from '../../utils/makeRequest';

export default function About() {
  const dataUrl = "https://toidev.indiatimes.com//microsite_v2_dyn_article_body.cms?crosshostconfig=83_1&msid=115244096&hostId=83";

  const [textComponent, setTextComponent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          headers: {
          'Accept': 'text/html',
          }
        };
        if (dataUrl) {
          const {response}= await makeRequest.get(
            dataUrl,
            options,
            null,
            'text'
          );
          setTextComponent(response); 
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
   
  }, []);


  return (
    <div className={s.about}>
      <div className="wrapper">
        {textComponent && (
          <div
          dangerouslySetInnerHTML={{ __html: textComponent }}
          />
        )}
        <div className={s.textContent}>
          <div className={s.subTitle}>subTitle</div>
          <div className={s.Description}>Description</div>
        </div>
      </div>
    </div>
  );
}
