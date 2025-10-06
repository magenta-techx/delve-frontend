'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";

import { BaseIcons, IconsType } from '@/assets/icons/base/Icons'

const Faqs = (): JSX.Element => {

    const [selectedFaq, setSelectedFaq] = useState<number | null>(null)


    const FAQS: {
        id: number;
        icon: IconsType;
        question: string;
        answer: string
    } []= [
            {
                id:1,
                icon: 'listing-black',
                question: 'How can I list my business on Delve?',
                answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus sapiente dolorum dicta recusandae voluptas sit similique consequatur libero, magni doloribus voluptate, obcaecati hic quasi, cupiditate corrupti et animi iste maiores!'
            },
            {
                id:2,
                icon: 'chat-black',
                question: 'How can I list my business on Delve?',
                answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus sapiente dolorum dicta recusandae voluptas sit similique consequatur libero, magni doloribus voluptate, obcaecati hic quasi, cupiditate corrupti et animi iste maiores!'
            },
            {
                id:3,
                icon: 'group-people-black',
                question: 'How can I list my business on Delve?',
                answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus sapiente dolorum dicta recusandae voluptas sit similique consequatur libero, magni doloribus voluptate, obcaecati hic quasi, cupiditate corrupti et animi iste maiores!'
            },
            {
                id: 5,
                icon: 'naira-circle-black',
                question: 'How can I list my business on Delve?',
                answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus sapiente dolorum dicta recusandae voluptas sit similique consequatur libero, magni doloribus voluptate, obcaecati hic quasi, cupiditate corrupti et animi iste maiores!'
            },
            {
                id:4,
                icon: 'person-circle-black',
                question: 'How can I list my business on Delve?',
                answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus sapiente dolorum dicta recusandae voluptas sit similique consequatur libero, magni doloribus voluptate, obcaecati hic quasi, cupiditate corrupti et animi iste maiores!'
            },
           
        ]

    return (
        <div className='flex flex-col items-center'>
            <h1 className='font-karma sm:text-[44px] text-[24px] section-header-underlined mb-16 text-center'>We are here to help with your questions</h1>


            <div className="flex flex-col gap-4">
                {FAQS.map((faq) => (
                    <div
                        key={faq.id}
                        className="bg-[#F8FAFC] border-[#ECE9FE] rounded-3xl border pl-4 py-8 pr-6"
                    >
                        <div className="sm:w-[1180px] flex items-center justify-between">
                            {/* Icon */}
                            <div className="hidden w-[30px] h-full sm:flex items-center justify-center">
                                <BaseIcons value={faq.icon} />
                            </div>

                            {/* Mobile  */}

                            {/* Question + Answer */}
                            <div className=" sm:hidden sm:w-[1100px] flex flex-col">

                                <div className='flex'>
                                    {/* Icon */}
                                    <div className="flex w-[20px] h-full sm:hidden items-center justify-center">
                                        <BaseIcons value={faq.icon} />
                                    </div>
                                    {/* Question */}
                                    <p
                                        className="inter border-l-[3px] px-4 pt-1 ml-4 text-[12px] border-[#E3E8EF] font-semibold"
                                    >
                                        {faq.question}
                                    </p>
                                    {/* Toggle Button with Rotating Arrow */}
                                    <button
                                        onClick={() =>
                                            setSelectedFaq(selectedFaq === faq.id ? null : faq.id)
                                        }
                                        className="flex items-center justify-center"
                                    >
                                        <motion.div
                                            animate={{ rotate: selectedFaq === faq.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <BaseIcons value="arrow-down-primary" />
                                        </motion.div>
                                    </button>
                                </div>

                                {/* Expanding Answer */}
                                <AnimatePresence>
                                    {selectedFaq === faq.id && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-gray-600 w-[290px] mt-3 text-[12px]">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>



                            {/* Deskstop  */}
                            <div className="border-l-[3px] border-[#E3E8EF] ml-3 px-4 hidden sm:flex w-[1100px] flex-col">
                                {/* Question */}
                                <motion.p
                                    animate={{
                                        fontSize: selectedFaq === faq.id ? "24px" : "20px",
                                        marginBottom: selectedFaq === faq.id ? "1rem" : "0.5rem",
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="inter font-semibold"
                                >
                                    {faq.question}
                                </motion.p>

                                {/* Expanding Answer */}
                                <AnimatePresence>
                                    {selectedFaq === faq.id && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Toggle Button with Rotating Arrow */}
                            <button
                                onClick={() =>
                                    setSelectedFaq(selectedFaq === faq.id ? null : faq.id)
                                }
                                className="sm:flex items-center hidden justify-center"
                            >
                                <motion.div
                                    animate={{ rotate: selectedFaq === faq.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <BaseIcons value="arrow-down-primary" />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Faqs