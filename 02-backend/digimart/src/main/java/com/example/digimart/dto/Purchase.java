package com.example.digimart.dto;

import com.example.digimart.entity.Address;
import com.example.digimart.entity.Customer;
import com.example.digimart.entity.Order;
import com.example.digimart.entity.OrderItem;

import java.util.Set;

public class Purchase {

    // define fields
    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;



    //constructors
    public Purchase(Customer customer, Address shippingAddress, Address billingAddress, Order order, Set<OrderItem> orderItems) {
        this.customer = customer;
        this.shippingAddress = shippingAddress;
        this.billingAddress = billingAddress;
        this.order = order;
        this.orderItems = orderItems;
    }

    public Purchase(){

    }




    //getters and setters
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(Address billingAddress) {
        this.billingAddress = billingAddress;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
