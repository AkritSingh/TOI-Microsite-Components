export const baseFaqSchemaShell = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [],
};

export const baseFaqItems = {
  '@type': 'Question',
  name: '',
  acceptedAnswer: {
    '@type': 'Answer',
    text: '',
  },
};
