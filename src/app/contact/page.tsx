"use client";

import { use, useEffect, useState } from "react";
import { ContentBodyContext } from "../clientLayout";
import Magnification from "@/components/Magnification";

const Twitter: React.FC = () => {
  return (
    <svg width="37px" height="31px" viewBox="0 0 37 31">
      <path
        d="M36.9230769,3.72981362 C35.5384615,4.3067367 34.0961538,4.76827516 32.5961538,4.94135208 C34.1538462,4.01827516 35.3653846,2.51827516 35.9423077,0.729813622 C34.5,1.59519824 32.8846154,2.22981362 31.1538462,2.57596747 C29.7115385,1.07596747 27.75,0.152890545 25.5576923,0.152890545 C21.3461538,0.152890545 18,3.5567367 18,7.71058285 C18,8.28750593 18.0576923,8.86442901 18.1730769,9.44135208 C11.8846154,9.15289055 6.28846154,6.09519824 2.59615385,1.53750593 C1.96153846,2.63365978 1.55769231,3.96058285 1.55769231,5.34519824 C1.55769231,7.99904439 2.88461538,10.3067367 4.90384615,11.6336598 C3.63461538,11.5759675 2.48076923,11.2298136 1.5,10.7105829 C1.5,10.7682752 1.5,10.7682752 1.5,10.8259675 C1.5,14.5182752 4.09615385,17.5759675 7.55769231,18.2682752 C6.92307692,18.4413521 6.23076923,18.5567367 5.53846154,18.5567367 C5.07692308,18.5567367 4.55769231,18.4990444 4.09615385,18.4413521 C5.07692308,21.4413521 7.84615385,23.6336598 11.1923077,23.6913521 C8.59615385,25.7105829 5.30769231,26.9221213 1.78846154,26.9221213 C1.15384615,26.9221213 0.576923077,26.864429 0,26.8067367 C3.34615385,28.8836598 7.32692308,30.1528905 11.5961538,30.1528905 C25.5576923,30.1528905 33.1730769,18.614429 33.1730769,8.57596747 C33.1730769,8.22981362 33.1730769,7.94135208 33.1730769,7.59519824 C34.6153846,6.5567367 35.8846154,5.22981362 36.9230769,3.72981362 Z"
        id="Shape"
      />
    </svg>
  );
};

const Github: React.FC = () => {
  return (
    <svg width="32px" height="33px" viewBox="0 0 32 33">
      <path d="M16,0.857548805 C7.15,0.857548805 0,8.0075488 0,16.8575488 C0,23.9075488 4.6,29.9075488 10.95,32.0575488 C11.75,32.2075488 12.05,31.7075488 12.05,31.3075488 C12.05,30.9075488 12.05,29.9075488 12.05,28.6075488 C7.6,29.5575488 6.65,26.4575488 6.65,26.4575488 C5.9,24.6075488 4.85,24.1075488 4.85,24.1075488 C3.4,23.1075488 4.95,23.1575488 4.95,23.1575488 C6.55,23.2575488 7.4,24.8075488 7.4,24.8075488 C8.85,27.2575488 11.15,26.5575488 12.05,26.1575488 C12.2,25.1075488 12.6,24.4075488 13.05,24.0075488 C9.5,23.6075488 5.75,22.2075488 5.75,16.1075488 C5.75,14.3575488 6.35,12.9575488 7.4,11.8075488 C7.25,11.4075488 6.7,9.7575488 7.55,7.5575488 C7.55,7.5575488 8.9,7.1075488 11.95,9.2075488 C13.25,8.8575488 14.6,8.6575488 15.95,8.6575488 C17.3,8.6575488 18.7,8.8575488 19.95,9.2075488 C23,7.1575488 24.35,7.5575488 24.35,7.5575488 C25.2,9.7575488 24.65,11.4075488 24.5,11.8075488 C25.55,12.9075488 26.15,14.3575488 26.15,16.1075488 C26.15,22.2575488 22.4,23.6075488 18.85,24.0075488 C19.4,24.5075488 19.95,25.4575488 19.95,26.9575488 C19.95,29.1075488 19.95,30.8075488 19.95,31.3575488 C19.95,31.8075488 20.25,32.3075488 21.05,32.1075488 C27.4,29.9075488 32,23.9075488 32,16.8575488 C32,8.0075488 24.85,0.857548805 16,0.857548805 Z" />
    </svg>
  );
};

const Instagram: React.FC = () => {
  return (
    <svg width="32px" height="33px" viewBox="0 0 32 33">
      <path d="M16,0.857548805 C20.3455,0.857548805 20.89,0.876048805 22.5965,0.953548805 C25.1975,1.0720488 27.4815,1.7095488 29.3145,3.5425488 C31.148,5.3765488 31.785,7.6605488 31.9035,10.2605488 C31.9815,11.9675488 32,12.5120488 32,16.8575488 C32,21.2030488 31.9815,21.7475488 31.904,23.4540488 C31.7855,26.0550488 31.148,28.3390488 29.315,30.1720488 C27.481,32.0055488 25.1965,32.6425488 22.597,32.7610488 C20.89,32.8390488 20.3455,32.8575488 16,32.8575488 C11.6545,32.8575488 11.11,32.8390488 9.4035,32.7615488 C6.8025,32.6430488 4.5185,32.0055488 2.6855,30.1725488 C0.852,28.3385488 0.215,26.0545488 0.0965,23.4545488 C0.0185,21.7475488 0,21.2030488 0,16.8575488 C0,12.5120488 0.0185,11.9675488 0.0965,10.2605488 C0.215,7.6595488 0.8525,5.3760488 2.685,3.5430488 C4.519,1.7095488 6.803,1.0725488 9.403,0.954048805 C11.11,0.876048805 11.6545,0.857548805 16,0.857548805 Z M16,3.7405488 C11.728,3.7405488 11.222,3.7565488 9.535,3.8335488 C7.714,3.9170488 6.0245,4.2815488 4.7245,5.5815488 C3.424,6.8815488 3.0595,8.5710488 2.9765,10.3920488 C2.8995,12.0795488 2.883,12.5855488 2.883,16.8575488 C2.883,21.1295488 2.899,21.6355488 2.976,23.3235488 C3.0595,25.1445488 3.424,26.8340488 4.724,28.1340488 C6.024,29.4345488 7.7135,29.7990488 9.5345,29.8820488 C11.2215,29.9590488 11.7275,29.9755488 16,29.9755488 C20.2725,29.9755488 20.7785,29.9590488 22.4655,29.8820488 C24.286,29.7985488 25.976,29.4340488 27.276,28.1340488 C28.5765,26.8340488 28.941,25.1445488 29.024,23.3235488 C29.101,21.6360488 29.1175,21.1305488 29.1175,16.8580488 C29.1175,12.5855488 29.101,12.0795488 29.024,10.3925488 C28.9405,8.5715488 28.576,6.8820488 27.276,5.5820488 C25.976,4.2815488 24.2865,3.9170488 22.4655,3.8340488 C20.778,3.7570488 20.272,3.7405488 16,3.7405488 Z M16,8.6415488 C20.5375,8.6415488 24.216,12.3200488 24.216,16.8575488 C24.216,21.3950488 20.5375,25.0735488 16,25.0735488 C11.4625,25.0735488 7.784,21.3950488 7.784,16.8575488 C7.784,12.3200488 11.4625,8.6415488 16,8.6415488 Z M16,22.1910488 C18.9455,22.1910488 21.3335,19.8030488 21.3335,16.8575488 C21.3335,13.9120488 18.9455,11.5240488 16,11.5240488 C13.0545,11.5240488 10.6665,13.9120488 10.6665,16.8575488 C10.6665,19.8030488 13.0545,22.1910488 16,22.1910488 Z M24.541,10.2365488 C23.4806133,10.2365488 22.621,9.37693552 22.621,8.3165488 C22.621,7.25616209 23.4806133,6.3965488 24.541,6.3965488 C25.6013867,6.3965488 26.461,7.25616209 26.461,8.3165488 C26.461,9.37693552 25.6013867,10.2365488 24.541,10.2365488 Z" />
    </svg>
  );
};

const Contact: React.FC = () => {
  const bodyDiv = use(ContentBodyContext);

  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    if (!bodyDiv) return;

    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setMinHeight(height - 200);
    });

    observer.observe(bodyDiv);

    return () => {
      observer.disconnect();
    };
  }, [bodyDiv]);

  return (
    <div
      className="w-96  box-content mx-auto text-center flex flex-col justify-center items-center"
      style={{
        minHeight: minHeight,
        fontFamily: "Mark",
      }}
    >
      <h3 className="text-2xl font-bold ">Mail me</h3>
      <a href="mailto:dzinlife@me.com" className="hover:underline ">
        dzinlife@me.com
      </a>
      <h3 className="text-2xl font-bold mt-6">Chat with me</h3>
      <span>WeChat: Dzinlife</span>
      <h3 className="text-2xl font-bold leading-8 mt-6">Follow me</h3>
      <Magnification
        className="mt-2"
        cellWidth={60}
        cellHeight={44}
        cellClassName="justify-center items-center "
      >
        <a
          href="https://twitter.com/i/flow/login?redirect_after_login=%2Fdzinlife"
          target="_blank"
        >
          <Twitter />
        </a>
        <a href="https://github.com/Dzinlife" target="_blank">
          <Github />
        </a>
        <a href="https://www.instagram.com/dzinlifes" target="_blank">
          <Instagram />
        </a>
      </Magnification>
    </div>
  );
};

export default Contact;
