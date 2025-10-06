'use client'
import { BusinessCategoryIcons, IconsType } from '@/assets/icons/business/BusinessCategoriesIcon';
// import Loader from '@/components/ui/Loader';
import Link from 'next/link';

interface CategoryProps {
    id: number;
    icon_name: string;
    name: string;
    categories: SubCategory[];
    subcategories: SubCategory[];
}

interface SubCategory {
    id: number;
    name: string; // backend sends plain strings
    subcategories?: SubCategory[];
}

interface listingUserMenuExtensionProps {
    categories?: CategoryProps[] | undefined
}

const ListingUserMenuExtension = ({ categories }: listingUserMenuExtensionProps): JSX.Element => {

    return (
        <div className="mt-8">
            <h1 className="font-inter text-[32px] font-extrabold mb-3">Browsers Category</h1>

            {/* {isLoadingcategories ? (
                <Loader borderColor="border-primary" />
            ) : ( */}
            {
                categories !== undefined && <div className="flex items-start">
                    {categories.map((category, key) => {

                        return <div
                            key={key}
                            className="w-[200px] mr-5 border-r-[1px] border-gray-200 "
                        >
                            <h1 className="text-gray-600 text-sm mb-3">{category.name}</h1>
                            <div className="flex flex-col gap-5">
                                {category.categories.map((subcategory) => {
                                    const icon = subcategory?.name
                                        ?.split(' ')[0]
                                        ?.toLowerCase() as IconsType;
                                    console.log("Icons: ", subcategory?.name, icon);

                                    return <div key={subcategory.id} className="w-[160px]">
                                        <Link
                                            href="/"
                                            className="hover:text-primary capitalize font-medium text-sm flex items-center gap-2"
                                        >
                                            <BusinessCategoryIcons
                                                value={icon}
                                            />
                                            <span className='truncate'>{subcategory.name.toLocaleLowerCase()}</span>
                                        </Link>

                                        {/* Render nested subcategories */}
                                        {subcategory.subcategories?.length ? (
                                            <div className="ml-8 mt-1 w-full text-wrap pr-2">
                                                {subcategory.subcategories.slice(0, 2).map((subsub, key) => (
                                                    <span
                                                        key={subsub.id}
                                                        className="text-[11px] leading-none mr-1"
                                                    >
                                                        {subsub.name}{key != 1 && ','}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                })}
                            </div>
                        </div>
                    })}
                </div>
            }

        </div>
    );
};

export default ListingUserMenuExtension;
