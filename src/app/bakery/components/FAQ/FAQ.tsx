"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ReactNode } from "react";
import { ExternalLink } from "@/app/core/components/ExternalLink";

function AccordionItem({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) {
  return (
    <Accordion.Item
      value={value}
      className="flex flex-col gap-4 bg-breadgray-ultra-white dark:bg-breadgray-charcoal p-4 md:px-6 rounded"
    >
      {children}
    </Accordion.Item>
  );
}

function AccordionHeader({ children }: { children: ReactNode }) {
  return (
    <Accordion.Header className="dark:text-breadgray-ultra-white text-xl font-semibold">
      {children}
    </Accordion.Header>
  );
}

function AccordionTrigger({ children }: { children: ReactNode }) {
  return (
    <Accordion.Trigger className="w-full text-left grid grid-cols-faq-trigger gap-4 justify-between group">
      {children}
      <div className="size-6 text-breadgray-grey100 dark:text-breadgray-ultra-white">
        <svg
          className="w-full h-full fill-current group-data-[state=open]:rotate-180"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 8H5V10H7V12H9V14H11V16H13V14H15V12H17V10H19V8H17V10H15V12H13V14H11V12H9V10H7V8Z"
          />
        </svg>
      </div>
    </Accordion.Trigger>
  );
}

function AccordionContent({ children }: { children: ReactNode }) {
  return (
    <Accordion.Content>
      <div className="border-t-[1px] border-breadviolet-shaded py-6">
        <div className="prose prose-pink dark:prose-invert">{children}</div>
      </div>
    </Accordion.Content>
  );
}

export default function FAQ() {
  return (
    <section className="pb-16 sm:pb-28">
      <Accordion.Root
        type="single"
        className="flex flex-col gap-1 max-w-2xl m-auto px-2"
        collapsible
      >
        <AccordionItem value="first">
          <AccordionHeader>
            <AccordionTrigger>What is Breadchain and BREAD?</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>
              Breadchain is a collective federation of decentralized cooperative
              projects looking to advance a post-capitalist vision for
              blockchain and its effect on society. We aim to do this by
              building what we call{" "}
              <ExternalLink href="https://breadchain.mirror.xyz/nwQx4CqPAcwZ5zSNB2_K25N1quOF1NGcKaYcS3S33CA">
                solidarity primitives
              </ExternalLink>{" "}
              like the Bread Crowdstaking Application. You can learn more about
              us on our{" "}
              <ExternalLink href="https://breadchain.xyz">
                home page
              </ExternalLink>{" "}
              or public Notion.
            </p>
            <p>
              All you need is an Ethereum wallet with xDAI on{" "}
              <ExternalLink href="https://chainlist.org/chain/100">
                Gnosis Chain
              </ExternalLink>{" "}
              and through this application you can bake BREAD, our digital
              community currency which helps fund the project to build
              post-capitalist tools and organizations.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionHeader>
            <AccordionTrigger>
              How does baking BREAD help build post-capitalism?
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>
              When baking BREAD, your xDAI gets automatically converted to sDAI
              in order to generate yield from the{" "}
              <ExternalLink href="https://docs.sparkprotocol.io/faq/dai-savings-rate-dsr">
                DAI savings rate
              </ExternalLink>
              . 100% of the interest earned on this sDAI is used to help fund
              the projects that exist within the{" "}
              <ExternalLink href="https://breadchain.xyz/#projects">
                Breadchain Network
              </ExternalLink>
              . As such, the Crowdstaking Application functions as an engine for
              fundraising different from donations. We do not accept venture
              capital investment.
            </p>
            <p>
              To learn more about how we govern the disbursement of yield, check
              out this page in our public Notion.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="third">
          <AccordionHeader>
            <AccordionTrigger>What is the price of BREAD?</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>
              1 xDAI (worth roughly $1 USD) is always equal to 1 BREAD and
              vice-versa. The BREAD token is not speculative and is always worth
              1 xDAI through this application. You can also get BREAD through
              decentralized exchanges like Curve.
            </p>
            <p>
              xDAI, which backs BREAD, is an over-collateralized stablecoin that
              comes from MakerDAO and is the native cryptocurrency of Gnosis
              Chain. Over-collateralized stablecoins offer a greater amount of
              security and less risk compared to other stablecoins.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fourth">
          <AccordionHeader>
            <AccordionTrigger>What if I want my xDAI back?</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>
              That’s totally fine! Any time you like, you can burn your BREAD
              and, in doing so, receive the equivalent amount of xDAI back. To
              do so simply click on the down arrow in the middle of the
              application. All BREAD is backed 1:1 by xDAI meaning burning BREAD
              is a risk free action - there will always be xDAI available for
              you to reclaim.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fifth">
          <AccordionHeader>
            <AccordionTrigger>What can I do with BREAD?</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>
              To find applications that are actively accepting BREAD, check out
              this page in our{" "}
              <ExternalLink href="https://breadchain.notion.site/Marketplace-ba2abef706464b8298401b1289d52662">
                Notion
              </ExternalLink>
              . As the Breadchain Network grows, we plan on offering more
              benefits to those who hold or transact with BREAD. To make sure
              you get those benefits, be sure to get our{" "}
              <ExternalLink href="https://app.questchains.xyz/gnosis/questing-with-breadchain">
                Questchain NFT
              </ExternalLink>
              . If you’re interested in partnering up in order to explore how
              you can use BREAD within your own project, please reach out to us
              at contact@breadchain.xyz.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sixth">
          <AccordionHeader>
            <AccordionTrigger>
              Why did you switch to Gnosis Chain?
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>
              We switched the crowdstaking application to Gnosis Chain for a few
              reasons. You can find the full reasoning on our public Notion page{" "}
              <ExternalLink href="https://breadchain.notion.site/Project-Pivot-Move-to-Gnosis-dc9397f6b25747d89770373e5e3d3ed7?pvs=25">
                here
              </ExternalLink>
              .
            </p>
            <p>In summary:</p>
            <ol className="list-decimal px-6 py-2">
              <li>
                We changed the source of yield to sDAI which gives a more stable
                yield in the long run.
              </li>
              <li>
                No more need for contract approval to interact with the
                application because we use xDAI, the native currency on Gnosis
                Chain
              </li>
              <li>
                We want to leverage Gnosis Pay to allow users to pay for real
                goods in BREAD
              </li>
              <li>Very low transaction fees</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion.Root>
    </section>
  );
}
