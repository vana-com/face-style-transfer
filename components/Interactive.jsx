import { useState, useMemo, useCallback } from "react";
import { vanaApiGet, vanaApiPost } from "vanaApi";
import { LoginHandler } from "components/auth/LoginHandler";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { motion } from "framer-motion";
import Image from "next/image";

const DEFAULT_PERSON = "Nicolas Cage";
const BASE_URL = "https://face-style-transfer.vercel.app/"; // 'face-style-transfer.vercel.app/'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uploader = Uploader({
  apiKey: "public_W142hdQGV5Tun9xWKUfwuz8bFo5Q",
});

const options = { multi: false };

const statusLookup = {
  succeeded: "Your image has uploaded.",
  failed: "Your image failed to process.",
  queued: "Your image is uploading.",
  processing: "Your image is being processed.",
};

export default function Interactive() {
  // User State
  const [user, setUser] = useState({
    balance: 0,
    exhibits: [],
    textToImage: [],
    loggedIn: false,
  });

  const [prediction, setPrediction] = useState(null);

  // Which generated image is previewed
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState(null);

  // Image Caption State
  const [imageUrl, setImageUrl] = useState(null);
  const [imageCaption, setImageCaption] = useState("");

  const removeGenderTokens = (str) => {
    if (!str) return "";
    return str
      .replaceAll(" woman ", " person ")
      .replaceAll(" woman, ", " person, ")
      .replaceAll(" man ", " person ")
      .replaceAll(" man, ", " person, ")
      .replaceAll(" his ", " their ")
      .replaceAll(" her ", " their ")
      .replaceAll(" boy ", " person ")
      .replaceAll(" boy, ", " person ")
      .replaceAll(" girl ", " person ")
      .replaceAll(" girl, ", " person, ")
      .replaceAll(" woman's ", " person's ")
      .replaceAll(" man's ", " person's ")
      .replaceAll(" boy's ", " person's ")
      .replaceAll(" girl's ", " person's ");
  };

  const prompt = useMemo(() => {
    if (imageCaption) {
      return `a portrait of [your subject] in the style of ${removeGenderTokens(
        imageCaption
      )}`;
    } else {
      return "Prompt not ready";
    }
  }, [imageCaption]);

  // Generating Image State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/2866ccfa-e0aa-40b7-9ec8-9056e6a12f0f/07fe20d1-6070-428f-bef1-ed4d5752a8a0.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=419e47ada40eb3c0f2fd486584548c06bf0dae48b7347cecfe5d10b6d372b08138ff57d79c6a1af6e6c7067c0331f386c8797e21a9a32ccc58eefa5ccde796ca5f16fb3d6aafe3e55eed1b337453b2fe6bddad6a8a70ac286d0cdbc74ce4c2119cc988fb5ef0d69eab6bc33e1d02f173cfaed459acde48f70eff3685176290d1f7552d65f4e146cdfe8a95c43fa623222c9b5808b4b9d2da00c41b7e35cc3bfef0b574f44be8564788d91816d97a84939a204a5edb1e3824739eec849416a4bc96869048e5e7c37362fa259b909f15d7e11abc3694827f77595996ca1d85c0b942c6ef26923a37f1b5344d53ae1e830a9b9f8f7045b5e4ebd3fda98608ca8357",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/2866ccfa-e0aa-40b7-9ec8-9056e6a12f0f/fa69291f-0f71-467a-aedd-919f55d143d7.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=08d5b4a291df60df7b20724589dcbf2090e8f7896fb7a815eebcd27e1be54c3caba6ba2854f21204581fbda5f31841a4a9dfcb9661818f7eaf27c5e6907c0bc03a2406f9aa13ee9f1ccda085e306a192b4ca837e439bbfe0944fd9ef62fc7fa194d9a9d95649f97854740abc09a415c0299588fa0cf8d2dfe32882fc103e8eb56a2485e98b1c2997b945a8dc2cd97e31856a48fb6766fca0b07ce9ba7c18e78e2ed5bf9ebef91ab1ab9176a9e4d4245d2439827f52eb3fafbbac0a3e4fe22c3cc6203de4e3a1fbf63935c628508f31c78742d93884ed52d46e3af5bbb64f6e4a7e58f0c8d98669cad1ca8e65b8b3ef8d7d207ac991cafc05027f818800a3019c",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/2866ccfa-e0aa-40b7-9ec8-9056e6a12f0f/16100ab9-10f7-438f-8e95-072ef55736f5.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=3bfc136ac3550d8d644baaf7fd1536eb12bc3a9a733093c7cab3cddaf4dea8485af9422776aa0ea2e99a4dadbf7e168e6b38029f63bf1bde8c5ab942d05662618e339a8b5cc11db06c16635ccf359ec4bb5eafdfedcd4d5183b30aab221ad111e5c15e26a4095381cfdfe3ef685283afea8446b064c4cb0883d848489f9b402ab3f9e7205afce7a1d2bd82042d59fd471e58fbb126ec2e42fd2a6ee4bfef797c644465f70ad52d5e3f87735f7babbec85eeeac172f80897e599a6893e8ffa0700c837af92f505fb4c9fe05ada11da2a661f9f0d58ad92de4f98043a3d90c4175f78a535736b5fe9b94edd970abc39028410f166584da56912afb2d4099651f4f",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/2866ccfa-e0aa-40b7-9ec8-9056e6a12f0f/12b29066-48cc-42f7-95f1-cff4b1bb2069.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=2f017acb42efd87ac0d6af140edf4df25166d2964beee46a10a2029b92d282624e53e6cc9ade1a4ae7de541a53ce0cffc116f386365b30841b6220399ba93687b9267a3fecd5eee23c0bf2e82f47b00ed1b2f1b441be0329698d6544d531debd5059c42fb9609c6491bc22d71c1a07ea4ffa84b819ae4803ba41c33e34782c0f872516e51602341a064bd9d48bcbb82298166ad60272a2df43718249fa408cc0d94251248ff440ffb6d686e226e4f1bef316682213c2c15191c0c5a10d73833b114aac3511686dea945959e6f1700dcc20bb0193e78ff7563efc8c392d4457a935d60eb67ae7f8eb343828ae678204ff2f6d8bfcf60a8a850fa8708179a38a9d",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/53d06487-fcf8-47f4-8992-30d51ceb5992/fc74cc3c-4897-41d0-8c89-6be71b3acf61.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=1eb0905ea19033ae7bb103bb48b663c8e22f0e8bd8dce6f23e7ea07ecd211d59aa933167e92892d4c512e90ea26a9c6da21b8da52462c53ed5ccedee22ebb460826e4eed1c99af4c9eeb183bac6c8619a5a1c9f492152b9ca0362f3ee43107716ddc349cebc378e19c2d6debc229a0a6e8f4c0d63626c88e2df97bfc7bf3f0db3a69b427e3172fcd3559604ca692a42adea483c06f186e67a6c3ce2f8ecc1fd4c11cd8d7f343c2a4f5ea2c37155fe9b8410f7a1986fd32795c51dbe81ac7afd6c125c293655690a5d75d768edce3b179750e7b9ec4f324f2171314c58d8dea0cb96c9dc76ba81601693ce0be596714e84c5cc16dd03db5329e2bce6aab30906c",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/53d06487-fcf8-47f4-8992-30d51ceb5992/5c5612ae-d68c-4f8d-bd08-7acb6c03c6c9.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=808df978650d50a2172408ce0d4a90654851ee354bb10b411aa5d24d7fafcca141f9850d5b73c323559ff62d62037e5f575143f39a33a0e55dbeb1e92689cd6e78425fc29651ac2da025d1da9e34ca162c445cc31c666bb2797fee76a3bde42f68f433d0241d88fc4bc979275fa18b367e7a78fbbf6a4ad78234b317530916b40b3beda6ccd37a9954d3449c1d140d050dfc57c18eebfd8605aad7d4117b83cca17da9e39874319457bd3e9e897df5608cf8d7ed97071bdfe1b5370d8ab1011321664610aad753f0babb2298570f971b6fba9f0bb9c4dc7ccd8589fb40035c2b7b16d5193a46b9178b8f87eaf35c05198b050120b6f44983deebf8fcc90e377b",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/53d06487-fcf8-47f4-8992-30d51ceb5992/b39fd7dd-aad8-46ea-a1f6-77627e27fb0f.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=002d8f547036d0e0c590141accf1dcf07d278d33c14e3ffc944357be74b7879116cc6afb5339a3b671c738f7cc7dfb314aacacb2dfb514f4e8106804e2f58efa29444a5ff7178b68e832502096472ff6ccef24efef02cfb2963ec9b2e81e4378c29eb6542f19479eeb94c9a9961f4edaa3b4ea7286540ec8d2aec3d28a43f3768ef3e9061f45af3a5ed03566ab6ce5991cf9d9b9f86d13321f797fa5fb85505010627312869659efabb8b902481fd5774769d1fab510766ba76e5773131d723f229d69526c9570efc45bb488d83b4ba0ea0dee9a9477b26754042411259431acd3e859fcbaa1836b7ea530a6848f442418bda4f4b77deb3ad016ca651ad3bd8e",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/53d06487-fcf8-47f4-8992-30d51ceb5992/cd2d15a8-3a0a-4032-a785-dd7fae49d115.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=641ad42b267199b8ef335da7fe987ca4dd702966f4e29fdaa5761bf067373746715dcd4f4de7f744d87cd37abd7f0f4e0947dc67e8aa713fb0ab4da931cb49d8ad9e484b3499d987f467b9cd8fc8ffd3f21cfacf76fc5262a96c1eea61597f5747d556f2594d83278031989854086c08d3232b40bf0b3b0f94927ea2b83b6382b483404f56f39284137a3a8e65aa64b6cc2ddaefbb53d25be9b906fc4e1c080e4fcfabf6cb49b76e3f85cbb95181cf8797ca3679ad746bf3fee78983b6d320ad82a2d5d37c9bc87d49aa9a205496e5fba6cdd20fef14e9123ce0480e059c0516a4a4f0c6fa9c806f9e1f5d78e0b604791c5653d720b2d155ac1842a7f9d37cd3",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/ef7538ab-f0b7-4ebc-8c8c-c82454274578/5e8882f0-b3da-41ac-9ed3-e0f530aab8e9.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=2e9fa561ea3c780175f20cc084e4304b466a6a8b05510679076837ea1eafece9cdc14e40c0b948d46fb82eaaab55aa69dea982be2798d252d715919c13f600e2262d5b9ebca132d6ab3c0cadaa2c0959e7f8cb46a022ce1ffef909c86a795c2c6ca2d65de6950a580530ae4c52cda952da88e6a8af331ff72a007e82e0e0383398a45442362c2d7207980d22f2e77764aec7feb457ae11d6d646c05267f8c4914075b5aa2df7dfb93adeb371072a06fb9bc42b1a8800995991a8dcec5d1255f895f14c5e75d1eec5198e2a296cfe252c218b422274a4d531f5f2be38afde22a644dff00412146c54e3d9fd14efcf19c98eac4afb417daaf257063ac0da9ea1d2",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/ef7538ab-f0b7-4ebc-8c8c-c82454274578/8a952131-a298-4c1a-8590-a8489fe6f06f.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=53d83101e1000a1e62812e941289273dae97ad4014a6c359338902d01ccd43d86003283eba019353db17d5326e73a6b3a41fa63e5b0fb5835ea43ff03d12f20e50fb3119d101f750312de1418741ed2b0057d066e426cc2173d61502d555cefa8e109c4c7ab39e00cbad84cff57be2d1426b22b051fc23c9620725e619fd0e12cedb2b1cc7650a857f35a8cc0afc46ceae8f3c5d883441475c820f876961335d981595020c3beb4fb172a7dd3961490ad1d9655ac71e19bcdff68a2149639b86a5e359cdadb75a57455466abf9630f0923dd394fd95f91d33964f5a56253da3434055d794fee5136ef66fea60edce6f1cce935ba0a9a2dd1b691a22febd42988",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/ef7538ab-f0b7-4ebc-8c8c-c82454274578/b7bcb774-0c3a-4b9c-97f8-2b9065e83086.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=3021b0b308cd6bf97ff1639ca113bf4dc46631029fa6677e221a03af7e244ed9146a25db0bedad74d5674d9b339fd187d5cbdafb6cc8b390f24c850477cb1536713d9568ecbd7557e3ec613fe471bb28087e8a515c492d52d3c24931497ac88c4da31c00186d27c10b94bd1dd2d1cb1d35b60fcf14bcc4daf01bc423df7b086f1925203a834172eb6d4e94dbc4b69a592863d4d9c6e4880a82e6c23c0da1ead3507bf28519b86d9b500a26daf5a900a38a67a403ad968ac92322249bd5d44d9af8929f017ff9f559adf9792f697365e74e8ecdc726c085b8f3c318c1d57104be66082316bcd46a669af1f48131c07c349f9e1208c763fc09deb5fa1dd9addd06",
    },
    {
      url: "https://storage.googleapis.com/vana-jobs-output-development/ef7538ab-f0b7-4ebc-8c8c-c82454274578/fb37822a-c416-4619-9eaf-1f6e7e9d8951.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=vana-app-user%40corsali-development.iam.gserviceaccount.com%2F20230310%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230310T190451Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=4332963e17af6e7430ae7ebd3e0fb8a3199c6ba0c877b55aa165be26f6d680da56ddcf7f5e9951dfcf440f53dd2c61fc7597341085104504b5730e1e78a1a8852cb2e9fb085a42edb4ef4de2251ea386e1670e608e3dfb5707223040130f7aaff3bf9b5d7fb30671433ece971f970eb3273f043a2a47a4e47a8edd5e7ab0c417e6b215650f4b82b1e634abcf02d7e8fb5d0b2e489d6d2fefcef305cf355d95fa5138e4c5cc9c3751a5c100f4753398845288f6f59697814c084df501fc2b9cd946df4884ba61ee165eaeb7df1a479232ee34d748630b033cb36dc45d4ed85dbbe50ee2aa11f2a4ed7bfb058ae18cf306426ca2bb316b93c066a28de30a8d8db9",
    },
  ]);

  const generatePersonalizedImages = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // const TESTING_PROMPT =
    //   "a portrait of [your subject] in the style of a painting of a person with a green apple in their mouth, by Rene Magritte, by René Magritte, rene margritte, rene magritte. hyperdetailed, ( ( ( surrealism ) ) ), rene magritte. detailed, magritte painting, style of rene magritte, magritte, surrealism aesthetic";

    const targetTokenPrompt = prompt
      .replace(/\[your subject]/g, "<1>")
      .replaceAll("\n", " ")
      .trim();

    try {
      console.log("About to call API");
      const account = await vanaApiGet("account");

      // Before running generations/images, we need need to train a new LoRA model using the POST personalizations/images endpoint
      if (account.success) {
        // Once the model is trained, we can run generations/images
        const generations = await vanaApiPost("generations/images", {
          exhibitName: "Learn Prompt Engineering",
          prompt: targetTokenPrompt, // "A watercolor painting of <1>",
        });
        console.log("generations", generations);

        // if (generations.success) {
        const output = await vanaApiGet("generations/images", {
          exhibitName: "Learn Prompt Engineering",
        });
        const urls = output.exhibits
          .find((d) => d.name === "Learn Prompt Engineering")
          .images.map((d) => ({ url: d.url }));
        console.log("urls", urls);
        setGeneratedImages(urls);
      }
    } catch (error) {
      setErrorMessage("An error occurred while generating the image");
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const getImageCaption = async (images) => {
    if (images.length === 0) return;
    console.log("Running image", images[0].fileUrl);
    setImageUrl(images[0].fileUrl);

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          // We could also try using the LAION clip model but the
          // openai one seemed to produce prompts for better images
          clip_model_name: "ViT-L-14/openai",
          image: images[0].fileUrl,
          mode: "fast",
        },
      }),
    });
    let multi = await response.json();
    setPrediction(multi);
    const predictionId = multi.uuid;
    if (response.status !== 201) {
      setErrorMessage(multi.detail);
      setIsLoading(false);
      return;
    }
    while (multi.status !== "succeeded" && multi.status !== "failed") {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + predictionId);
      const { prediction } = await response.json();
      multi = prediction;
      if (response.status !== 200) {
        setErrorMessage(multi.detail);
        setIsLoading(false);
        return;
      }
      setPrediction(prediction);
    }
    console.log(multi);
    setImageCaption(multi.output);
  };

  const generateNonPersonalizedImages = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      setErrorMessage("");

      const defaultPersonPrompt = prompt
        .replace(/\[your subject]/g, DEFAULT_PERSON)
        .replaceAll("\n", " ")
        .trim();

      const response = await fetch("/api/stable-diffusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            prompt: defaultPersonPrompt,
            num_outputs: 4,
          },
        }),
      });

      let multi = await response.json();
      const predictionId = multi.uuid;
      if (response.status !== 201) {
        setError(multi.detail);
        return;
      }
      while (multi.status !== "succeeded" && multi.status !== "failed") {
        await sleep(1000);
        const response = await fetch("/api/stable-diffusion/" + predictionId);
        const { prediction } = await response.json();
        multi = prediction;
        if (response.status !== 200) {
          setError(multi.detail);
          return;
        }
      }

      const formattedUrls = multi.output.map((imageUrl) => ({ url: imageUrl }));
      setGeneratedImages(formattedUrls);
      setIsLoading(false);
    },
    [prompt]
  );

  const DEFAULT_IMAGES = [
    "images/mona.jpg",
    "images/rene.jpg",
    "images/vangogh.jpg",
    "images/vertumnus.jpg",
  ];

  const [agreeToTOS, setAgreeToTOS] = useState(false);

  return (
    <div
      className="bg-white min-h-screen py-2 px-4 mx-auto flex flex-col justify-center"
      id="interactive"
    >
      <h1 className="text-4xl font-bold text-center mb-8">
        Try it out for yourself 👇
      </h1>
      <h2 className="mx-auto px-4 max-w-[568px] text-xl font-light text-gray-500 text-center mb-8">
        Upload an image of your desired style. Then, create a brand new portrait
        of yourself (or {DEFAULT_PERSON}) in this style!
      </h2>
      <LoginHandler setUser={setUser} />
      <button onClick={generatePersonalizedImages}>test</button>
      <div className="image-uploader-form text-center">
        {!imageUrl && (
          <>
            <div
              className={classNames(
                "transition duration-200",
                agreeToTOS ? "" : "opacity-50 cursor-not-allowed"
              )}
            >
              <UploadButton
                uploader={uploader}
                options={options}
                onComplete={getImageCaption}
              >
                {({ onClick }) => (
                  <button
                    onClick={onClick}
                    disabled={!agreeToTOS}
                    className="bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded"
                  >
                    {/* Select image... */}
                    Upload an image of the desired style
                  </button>
                )}
              </UploadButton>
              <h2 className="text-md font-light mt-4 text-center mb-2">
                (or select one)
              </h2>
              <div className="flex flex-row flex-wrap justify-center gap-2">
                {DEFAULT_IMAGES.map((image) => (
                  <div
                    className="cursor-pointer hover:scale-105 transition hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 rounded overflow-hidden"
                    key={image}
                    onClick={() => {
                      if (!agreeToTOS) return;
                      getImageCaption([{ fileUrl: `${BASE_URL}/${image}` }]);
                    }}
                  >
                    <img
                      src={image}
                      alt="Default Image"
                      className="w-32 h-32 object-cover"
                      style={{
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row gap-1 mt-6 justify-center">
              <label className="text-md font-light text-gray-500 cursor-pointer select-none flex items-center">
                <input
                  type="checkbox"
                  checked={agreeToTOS}
                  onChange={(e) => {
                    setAgreeToTOS(e.target.checked);
                  }}
                  className="mr-2 cursor-pointer"
                />
                I agree to the{" "}
                <a
                  href="https://www.vana.com/terms-of-service"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ml-1 text-blue-500 hover:underline hover:underline-offset-4"
                >
                  Vana Terms of Service
                </a>
              </label>
            </div>
          </>
        )}
        <div className="w-full flex flex-col items-center justify-center my-6">
          {imageUrl && (
            <motion.div
              layout="position"
              className="w-full flex flex-col md:flex-row items-center justify-evenly md:items-start
              gap-8 md:gap-4"
            >
              <div className="flex-1 max-w-[500px] w-full">
                <h1 className="text-lg md:text-base lg:text-lg font-medium mb-2">
                  {/* {statusLookup[prediction?.status]} */}
                  Step 1: Upload an image of the desired style
                  <span
                    className="bg-stone-200 text-stone-700 text-sm font-medium rounded-md px-2 py-1 ml-2 cursor-pointer hover:bg-stone-300"
                    style={{
                      verticalAlign: "middle",
                    }}
                    onClick={() => {
                      setImageUrl(null);
                      setImageCaption(null);
                      setGeneratedImages([]);
                      setSelectedGeneratedImage(null);
                      setIsLoading(false);
                    }}
                  >
                    Restart
                  </span>
                </h1>
                <img
                  src={imageUrl}
                  alt="Uploaded Image"
                  layout="position"
                  className={classNames(
                    "w-full aspect-square object-cover rounded",
                    prediction
                      ? prediction.status == "failed"
                        ? "opacity-50"
                        : prediction.status !== "succeeded" && isLoading
                        ? "animate-pulse"
                        : ""
                      : ""
                  )}
                  style={{
                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <p className="mt-2 text-left font-light text-gray-500 text-sm bg-stone-200 p-2 rounded-md">
                  {prediction
                    ? prediction.status !== "succeeded"
                      ? statusLookup[prediction.status]
                      : removeGenderTokens(imageCaption)
                    : ""}

                  {errorMessage && `Error: ${errorMessage}`}
                </p>
              </div>
              <div
                className={classNames(
                  "flex-1 max-w-[500px] w-full",
                  prediction?.status === "succeeded"
                    ? "opacity-100"
                    : "opacity-25"
                )}
              >
                <h1 className="text-lg md:text-base lg:text-lg font-medium mb-2">
                  {/* Your AI-generated face style transfer */}
                  Step 2: Create a portrait of a person in this style
                </h1>

                {imageCaption &&
                prediction.status == "succeeded" &&
                generatedImages?.length > 0 ? (
                  <>
                    <img
                      src={selectedGeneratedImage || generatedImages[0].url}
                      alt="Uploaded Image"
                      layout="position"
                      className={classNames(
                        "w-full aspect-square object-cover rounded"
                      )}
                      style={{
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <div className="mt-2 flex flex-row gap-1">
                      {generatedImages?.slice(0, 4).map((image, i) => (
                        <div
                          className={classNames(
                            "flex-1 aspect-square cursor-pointer hover:scale-105 transition hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 rounded overflow-hidden",
                            selectedGeneratedImage === image.url
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : ""
                          )}
                          key={i}
                          onClick={() => setSelectedGeneratedImage(image.url)}
                        >
                          <img src={image.url} />
                        </div>
                      ))}
                    </div>
                    <p className="text-right font-light text-gray-500 text-sm mt-2">
                      Get maximum control over your digital self on{" "}
                      <a
                        href="https://www.vana.com"
                        target="_blank"
                        className="text-blue-500 hover:underline hover:underline-offset-4"
                      >
                        Vana.
                      </a>
                    </p>
                  </>
                ) : (
                  <div
                    className={classNames(
                      "flex flex-col gap-2 h-full",
                      isLoading ? "animate-pulse" : ""
                    )}
                  >
                    {imageCaption && prediction.status == "succeeded" && (
                      <div className="flex flex-col gap-2 h-full justify-center">
                        {/* <label htmlFor="prompt-input">Prompt:</label> */}
                        <p className="text-center text-md font-light text-gray-600 mb-px leading-snug">
                          Generate a portrait using the following prompt:
                        </p>
                        <p className="text-left font-light text-gray-500 text-lg  bg-stone-100 px-2 py-1 border border-blue-200">
                          {prediction &&
                            prediction.status === "succeeded" &&
                            prompt}
                          {/* `${prompt.replace(
                              "{target_token}",
                              hoveredPersonString
                            )}`} */}
                        </p>

                        <div className="flex flex-col gap-1 w-full">
                          <form onSubmit={generateNonPersonalizedImages}>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded w-full"
                              type="submit"
                              disabled={isLoading}
                            >
                              Create Portrait of {DEFAULT_PERSON}
                            </button>
                          </form>
                          {/* Generic inference if a user hasn't connected VNA */}
                          {!user.loggedIn && (
                            <>
                              <LoginHandler setUser={setUser} />
                            </>
                          )}
                          {/* Personalized inference once a user connects VNA*/}
                          {user.loggedIn && (
                            <div className="flex flex-col">
                              <form onSubmit={generatePersonalizedImages}>
                                <button
                                  className="bg-blue-500 hover:bg-blue-700 transition text-white font-light py-2 px-4 rounded w-full
                      disabled:opacity-50 disabled:cursor-not-allowed"
                                  type="submit"
                                  disabled={user?.balance == 0 || isLoading}
                                >
                                  Create Portrait of You (4 credits)
                                </button>
                              </form>
                              {/* Agree to TOS */}
                              <p
                                className={classNames(
                                  "mt-px text-right font-light text-gray-500 text-sm",
                                  user?.balance == 0
                                    ? "text-red-500"
                                    : "text-gray-500"
                                )}
                              >
                                Credit balance: {user?.balance ?? 0}
                              </p>
                            </div>
                          )}
                          {/* {isLoading && <p>Loading...</p>} */}
                          {errorMessage && <p>Error: {errorMessage}</p>}
                          {/* User doesn't have a trained model*/}
                          {user.loggedIn && user.exhibits.length === 0 && (
                            <p>
                              Unfortunately, you haven't created a personalized
                              Vana Portrait model yet. Go to
                              https://portrait.vana.com/create to create one 🙂
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
