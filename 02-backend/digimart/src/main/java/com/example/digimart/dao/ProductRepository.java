package com.example.digimart.dao;

import com.example.digimart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("https://localhost:4200")
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);
    // this is an endpoint that corresponds to "http://localhost:8080/api/products/search/findByCategoryId?id=something"
    // and will return all products having category id  = something


    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
    // above corresponds to endpoint "http://localhost:8080/api/products/search/findBynameContaining?name=somthing"
    // this is used while implementing the "search by keyword" functionlality
    // we pass the keyword "name" through url and using this methos, spring data rest returns all products whose name contains the passed keyword(keyword is represented by the word name in url).
}
